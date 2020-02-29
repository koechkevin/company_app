import { END, eventChannel, EventChannel } from 'redux-saga';

import { ApiUrl } from './ApiConfig';
import { GET_API, POST_FILES_API, source } from './AxiosInstance';

export class FileService {
  public static createUploadChannel(file: File): EventChannel<any> {
    const data = new FormData();
    data.append('file', file);

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    return eventChannel((emitter: (params?: any) => void) => {
      const config = {
        onUploadProgress: (event: any) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          emitter({ percent });
        },
      };

      POST_FILES_API(ApiUrl.FILE_UPLOAD, data, config)
        .then((res: any) => {
          if (res) {
            emitter(res);
            emitter(END);
          }
        })
        .catch((err: Error) => {
          emitter(err);
          emitter(END);
        });

      return () => {
        source.cancel();
      };
    });
  }

  public static downloadFile(url: string, filename: string): void {
    GET_API(url)
      .then((res: any) => res.blob())
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = filename;
        a.click();
      });
  }
}
