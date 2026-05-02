const { metro, patcher } = vendetta;
const { findByProps } = metro;

let unpatch;

export default {
    onLoad: () => {
        try {
            // Discord'un ses kutucuğu bileşenini bulmaya çalışıyoruz
            // Farklı sürümlerde farklı isimler olabildiği için hepsini deniyoruz
            const VoiceTile = findByProps("VoiceUserTile") || findByProps("VoiceUser") || findByProps("RTCConnectionVoice");

            if (!VoiceTile) {
                console.error("[SquareVoice] Ses bileşeni bulunamadı.");
                return;
            }

            // Bileşene yama (patch) atıyoruz
            unpatch = patcher.after("default", VoiceTile, (args, res) => {
                // Eğer dönen sonuç geçerli bir UI elemanı değilse işlem yapma
                if (!res || !res.props) return res;

                try {
                    const props = args[0] || {};
                    // Kamera açık mı, yayın var mı kontrol et
                    const isVideo = props.video || props.stream || props.hasVideo;

                    // Stil objesi varsa müdahale et
                    if (res.props.style) {
                        if (isVideo) {
                            // Kamera/Yayın: Sinematik (16:9) ve tam genişlik
                            res.props.style.aspectRatio = 16 / 9;
                            res.props.style.width = "100%";
                            res.props.style.borderRadius = 12;
                            res.props.style.marginBottom = 8;
                        } else {
                            // Normal Ses: Kare (1:1) ve yan yana dizilim için %48 genişlik
                            res.props.style.aspectRatio = 1;
                            res.props.style.width = "48%";
                            res.props.style.borderRadius = 8;
                            res.props.style.margin = "1%";
                        }
                    }
                } catch (e) {
                    // Stil uygulama hatasını sessizce geç ki uygulama çökmesin
                }

                return res;
            });
        } catch (err) {
            console.error("[SquareVoice] Eklenti yüklenirken büyük bir hata oluştu:", err);
        }
    },

    onUnload: () => {
        // Eklenti kapatıldığında veya silindiğinde yamayı kaldır
        if (typeof unpatch === "function") {
            unpatch();
        }
    }
};
