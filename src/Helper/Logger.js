import { createLogger, format, transports } from 'winston';
import Transport from 'winston-transport';
import voice_alert from "../assests/sound/voice_alert.mp3";
const errorSound = new Audio(voice_alert);

class CustomTransport extends Transport {
    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        if(info.level.includes('error')) {
            errorSound.play();
        }

        console.log(`${info.timestamp} ${info.level} ${info.message}`);
        callback();
    }
}

transports.CustomTransport = CustomTransport;

const logger = createLogger({
    level: 'silly',
    format: format.combine(
        format.splat(),
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSSS' })
    ),
    transports: [new (transports.CustomTransport)]
});

export default logger;