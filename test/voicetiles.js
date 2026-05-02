const { metro, patcher } = vendetta;
const { findByProps, findByName } = metro;

let unpatch;

export default {
    onLoad: () => {
        // Metro üzerinden Discord'un sesli sohbet kutucuğu bileşenini buluyoruz
        const VoiceTile = findByProps("VoiceUserTile") || findByName("VoiceUserTile") || findByProps("VoiceUser");

        if (!VoiceTile) {
            console.error("[SquareVoice] Metro Modülü Bulunamadı: VoiceUserTile");
            return;
        }

        // Bileşenin varsayılan render çıktısına yama yapıyoruz
        unpatch = patcher.after("default", VoiceTile, (args, res) => {
            try {
                // Katılımcının özelliklerini al (kamera, yayın vs.)
                const props = args[0] || {};
                const isVideo = props.video || props.stream || props.hasVideo;

                // Stilleri Vendetta üzerinden manipüle et
                if (res && res.props && res.props.style) {
                    if (isVideo) {
                        // Kamera/Yayın: Geniş ekran (16:9) ve tam satır
                        res.props.style.aspectRatio = 16 / 9;
                        res.props.style.width = "100%";
                        res.props.style.borderRadius = 12;
                    } else {
                        // Normal Ses: Kare (1:1) ve yan yana sığması için %48 genişlik
                        res.props.style.aspectRatio = 1;
                        res.props.style.width = "48%"; 
                        res.props.style.borderRadius = 8;
                    }
                }
            } catch (err) {
                console.error("[SquareVoice] Stil uygulanırken hata:", err);
            }
            
            return res;
        });
    },

    onUnload: () => {
        // Eklenti kapatıldığında Vendetta yamalarını geri al
        if (unpatch) {
            unpatch();
        }
    }
};
