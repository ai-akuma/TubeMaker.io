import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  throwError,
  Subject,
  catchError,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  audioFile: {
    title: string;
    file: File;
  };

  private voiceObserverSubject = new Subject<{ name: string; sampleUrl: string; value: string }[]>();
  private textToSpeechObserverSubject = new Subject<string>();

  constructor(
    private http: HttpClient
  ) {}

  private baseUrl = 'http://localhost:3000';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer 5992824d1a1b4779a76e4176ca0d1d07',
    'X-USER-ID': 'Y0Yo31zn6ofKRyhNFyNj1gSxEJ63',
  });

  getVoiceOptionsObserver(): Observable<{ name: string; sampleUrl: string }[]> {
    return this.voiceObserverSubject.asObservable();
  }

  getTextToSpeechObserver(): Observable<string> {
    return this.textToSpeechObserverSubject.asObservable();
  }

  getVoiceOptions() {
    this.http
      .get<{ name: string; sample: string; value: string }[]>(
        `${this.baseUrl}/api/voice/voices`,
        { headers: this.headers }
      )
      .subscribe((data) => {
        let displayVoices: {
          name: string;
          sampleUrl: string;
          value: string;
        }[] = [];
        data.forEach((voice) => {
          displayVoices.push({
            name: voice.name,
            sampleUrl: voice.sample,
            value: voice.value,
          });
        });
        this.voiceObserverSubject.next(displayVoices);
      });
  }

  updateAudioFile(file: File) {
    this.audioFile = {
      title: file.name,
      file: file,
    };
  }

  generateTextToSpeech(voiceValue: string, script: string) {
    const reqBody = {
      voice: voiceValue,
      content: script
    };
    this.http.post<{ message: string, error: boolean, audioUrl: string }>(`${this.baseUrl}/api/voice/generate`, reqBody, {headers: this.headers})
    .pipe(
      catchError((err) => {
        console.log("~ file: voice.service.ts:89 ~ VoiceService ~ catchError ~ err:", err)
        return throwError(err);
      }
    )).subscribe((audioResponse) => {
      //we've generated, waited, and this is the final URL
      if (audioResponse.error === false) {
        console.log("🚀 ~ file: voice.service.ts:93 ~ catchError ~ convertResponse:", audioResponse)
        this.textToSpeechObserverSubject.next(audioResponse.audioUrl)
      } else {
        console.log("🔥 ~ file: voice.service.ts:96 ~ catchError ~ convertResponse:", audioResponse)
      }
    });
  }
}