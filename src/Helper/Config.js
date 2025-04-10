import voice_alert from "../assests/sound/voice_alert.mp3";
import messagebox from "../assests/sound/messagebox.mp3";
import bigbox from "../assests/sound/bigbox.mp3";
import smallbox from "../assests/sound/smallbox.mp3";

const errorSound = new Audio(voice_alert);
const notificationSound = new Audio(messagebox);
const successSound = new Audio(bigbox);
const infoSound = new Audio(smallbox);

export const notifyOptions = {
    message: '',
    closeOnClick: true,
    rtlEnabled: true,
    displayTime: 4000,
    onShowing: function (e) {
        switch (e.component._options.type) {
            case "Info":
                notificationSound.play();
                break;
            case "warning":
                infoSound.play();
                break;
            case "success":
                successSound.play();
                break;
            case "error":
                errorSound.play();
                break;
        }
    }
};