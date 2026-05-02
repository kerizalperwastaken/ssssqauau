// squareTiles.js
import { definePlugin } from "@kettu/plugin";
import { findByName } from "@kettu/metro";
import { after } from "@kettu/patcher";

export default definePlugin({
  onLoad() {
    const VoiceTile = findByName("VoiceTile", false);
    if (VoiceTile) {
      this.unpatch = after("render", VoiceTile, (_, ret) => {
        if (ret?.props?.style) {
          ret.props.style.borderRadius = 0;
        }
        return ret;
      });
    }
  },
  onUnload() {
    this.unpatch?.();
  }
});
