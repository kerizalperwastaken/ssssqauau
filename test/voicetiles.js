const { metro } = vendetta;
const { findByProps } = metro;

// Gerekli stil ve bileşenleri bulalım
const VoiceTile = findByProps("VoiceUserTile");
const Styles = findByProps("tile", "videoTile");

export default {
    name: "SquareVoiceBigCamera",
    description: "Ses kutucuklarını kare yapar, kamera açanları büyütür.",
    authors: [{ name: "Gemini", id: "0" }],
    version: "1.0.0",

    onStart() {
        // Stil üzerine yama (patch) atıyoruz
        this.patch = vendetta.patcher.after("render", VoiceTile, ([props], res) => {
            const isVideo = props.video || props.stream;

            // Kutucuk stillerine müdahale
            if (res?.props?.style) {
                if (isVideo) {
                    // Kamera açanlar: Büyük ve 16:9 oranında
                    res.props.style.width = "100%";
                    res.props.style.aspectRatio = 16 / 9;
                    res.props.style.borderRadius = 12;
                } else {
                    // Normal kullanıcılar: Kare
                    res.props.style.aspectRatio = 1;
                    res.props.style.width = "48%"; // Yan yana iki kare için
                    res.props.style.borderRadius = 8;
                }
            }
            return res;
        });
    },

    onStop() {
        this.patch?.();
    }
};
