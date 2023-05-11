import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {GridaService} from '../service/grida.service';
import {ToastrService} from 'ngx-toastr';
import {uid} from 'uid';

declare let Kakao: any;

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {


  isRecording = false;
  mediaRecorder;
  audioArray = [];
  image = null;
  sttRequest;

  questions = '';
  questioning = false;
  generatingAnswer = false;

  chatRequests = [
    {role: 'system', message: '다음은 인천 스타트업 파크라는 행사에서 시연되는 에이프리카 라는 회사의 PoomGPT 이라는 이름의 챗봇과 사용자의 대화이다.'}
  ];

  imageList = [];

  public talkCount = 0;

  public admin = false;
  public inputMode = 'text';

  public muteMode = false;

  cursorFollower = false;

  dragging = false;
  private valueAudio: HTMLAudioElement = null;

  constructor(
    private gridaService: GridaService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) { }
  codeMirrorOptions: any = {
    theme: 'darcula',
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: false,
    foldGutter: true,
    readOnly: true
  };

  ngOnInit() {
    this.gridaService.getGritalkCount().subscribe(res => {
      this.talkCount = res.count;
    });
    if (localStorage.getItem('gridaSession')) {
      this.admin = true;
    }

    if (!Kakao.isInitialized()) {
      Kakao.init('19dd64ba69e8fe649f26f300d67fcaff');
    }

    const cursorFollower = document.getElementById('cursorFollower');

    document.addEventListener('mousemove', (e) => {
      cursorFollower.style.top = e.pageY + 10 + 'px';
      cursorFollower.style.left = e.pageX + 10 + 'px';
    });
  }

  public changeMode(value: string) {
    this.inputMode = value;
  }

  public mute() {
    this.muteMode = !this.muteMode;
    if (this.valueAudio) {
      this.valueAudio.pause();
      this.valueAudio = null;
    }
  }
  public generateAnswerToText() {
    const questions = this.questions;

    if (this.questions !== '') {
      this.questions = '';
      this.generatingAnswer = true;

      this.gridaService.generateAnswer('normal', questions, this.chatRequests).subscribe(res => {
        this.addGritalkCount();
        this.resultBinding(res);
      }, (error) => {
        this.generatingAnswer = false;
        alert('잘못된 처리 입니다. 잠시 후 다시 시도해주세요');
      });
    }
  }

  public generateAnswerToVoice() {
    this.questioning = true;
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.timeout();
    }
  }

  public copyCode(codeText: string) {
    navigator.clipboard.writeText(codeText).then(r => this.toastr.success('클립보드에 복사되었습니다!'));
  }

  public timeout() {
    setTimeout(() => {
      this.mediaRecorder.stop();
      setTimeout(() => {
        this.stopRecording();
      }, 100);
    }, 400);
  }

  public async startRecording() {
    this.isRecording = true;
    const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.mediaRecorder = new MediaRecorder(mediaStream);
    this.mediaRecorder.ondataavailable = (event) => {
      this.audioArray.push(event.data);
    };

    this.mediaRecorder.start();
  }

  public stopRecording() {
    const inputBlob = new Blob(this.audioArray, {type: 'video/webm'});
    this.questioning = false;
    this.generatingAnswer = true;

    this.gridaService.generateAnswer('voice', null, this.chatRequests,  new File([inputBlob], 'input.webm'))
      .subscribe(res => {
      this.resultBinding(res);
      this.addGritalkCount();
    }, (error) => {
        this.generatingAnswer = false;
        alert('잘못된 처리 입니다. 잠시 후 다시 시도해주세요');
      });
  }

  public resultBinding(res) {
    const value = JSON.parse(atob(res.data[0].result));
    this.sttRequest = value;
    console.log(this.sttRequest);
    if (this.sttRequest.chatType === 'textToImage') {
      const image = {
        imageId: uid(),
        imageContent: 'data:image/png;base64,' + this.sttRequest.imageContent,
      };
      this.imageList.push(image);

      const question = {
        type: 'text',
        role: 'user',
        imageId: '',
        message: this.sttRequest.requestedContent
      };
      this.chatRequests.push(question);

      const answer = {
        type: 'image',
        role: 'assistant',
        imageId: image.imageId,
        message: this.sttRequest.answer
      };
      this.chatRequests.push(answer);

    } else if (this.sttRequest.chatType === 'voice') {
      const question = {
        type: 'text',
        role: 'user',
        imageId: '',
        message: this.sttRequest.requestedContent
      };
      this.chatRequests.push(question);

      const answer = {
        type: 'text',
        role: 'assistant',
        imageId: '',
        message: this.sttRequest.answer
      };
      this.chatRequests.push(answer);
    } else if (this.sttRequest.chatType === 'imageToText') {
      const image = {
        imageId: uid(),
        imageContent: this.sttRequest.requestedContent,
      };
      this.imageList.push(image);

      const question = {
        type: 'image',
        role: 'user',
        imageId: image.imageId,
        message: ''
      };
      this.chatRequests.push(question);

      const answer = {
        type: 'text',
        role: 'assistant',
        imageId: '',
        message: this.sttRequest.answer
      };
      this.chatRequests.push(answer);
    } else if (this.sttRequest.chatType === 'summary') {
      const answer = {
        type: 'text',
        role: 'assistant',
        imageId: '',
        message: this.sttRequest.answer
      };
      this.chatRequests.push(answer);
    } else {
      const question = {
        type: 'text',
        role: 'user',
        imageId: '',
        message: this.sttRequest.requestedContent
      };
      this.chatRequests.push(question);

      const answer = {
        type: 'text',
        role: 'assistant',
        imageId: '',
        message: this.sttRequest.answer
      };
      if (this.sttRequest.chtType === 'summary') {
        answer.message = this.sttRequest.answer.replace('\n', '').replace('\n', '');
      }
      this.chatRequests.push(answer);
    }

    if (!this.muteMode) {
      const valueAudioBinaryString = atob(value.audioContent);
      const valueAudioBytes = new Uint8Array(valueAudioBinaryString.length);
      for (let i = 0; i < valueAudioBinaryString.length; i++) {
        valueAudioBytes[i] = valueAudioBinaryString.charCodeAt(i);
      }
      const valueAudioBlob = new Blob([valueAudioBytes.buffer], {type: 'audio/mp4'});
      if (this.valueAudio !== null) {
        this.valueAudio.pause();
      }
      this.valueAudio = new Audio(URL.createObjectURL(valueAudioBlob));
      this.valueAudio.addEventListener('ended', () => {
        this.valueAudio = null;
      });
      this.valueAudio.play();
    }

    // media 변수 초기화
    this.mediaRecorder = null;
    this.audioArray = [];
    this.isRecording = false;

    this.generatingAnswer = false;

    const view = document.getElementById('view');
    const viewHeight = view.scrollHeight;

    setTimeout(() => {
      view.scrollTo(0, viewHeight);
    }, 10);
  }

  addGritalkCount() {
    this.gridaService.addGritalkCount().subscribe(res => {
      this.talkCount = res.count;
    });
  }

  share(sns, message) {
    if (confirm('공유된 정보의 사실여부에 대한 책임은 개인에게 있습니다.')) {
      if (sns === 'kakao') {
        this.kakaoShare(message);
      } else if (sns === 'facebook') {
        this.facebookShare(message);
      }
    }
  }

  kakaoShare(message) {
    Kakao.Share.sendDefault({
      objectType: 'text',
      text: message,
      link: {
        mobileWebUrl: 'https://grida.ga',
        webUrl: 'https://grida.ga',
      },
    });
  }

  facebookShare(message) {
    const thisUrl = 'https://grida.ga';
    const snsTitle = 'GRIDA';
    const url = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(thisUrl);
    window.open(url, snsTitle, 'width=500, height=610');
  }

  mouseOverMarkdown() {
    this.cursorFollower = !this.cursorFollower;
  }

  findImage(imageId: string) {
    const image = this.imageList.find(imageValue => imageValue.imageId === imageId);
    return image.imageContent;
  }

  async onDrop(event: any) {
    this.dragging = false;
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file.size > 5120 * 1000) {
      alert('파일이 너무 큽니다.');
      return;
    }
    this.generatingAnswer = true;

    if (file.type.startsWith('image/')) {
      const imageBase64 = await this.encodeFileToBase64(file);
      this.gridaService.generateAnswer('imageToText', imageBase64).subscribe((result) => {
        this.resultBinding(result);
      }, (error) => {
        this.generatingAnswer = false;
        alert('잘못된 처리 입니다. 잠시 후 다시 시도해주세요');
      });
    } else if (
      file.type === 'application/pdf' ||
      file.type === 'text/plain' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      (file.type === '' && file.name.substring(file.name.lastIndexOf('.')) === '.hwp')) {
      const questions = {
        type: 'textFile',
        role: 'user',
        message: file.name,
        imageId: ''
      };
      this.chatRequests.push(questions);
      this.gridaService.generateAnswer('summary', null, null, file).subscribe((result) => {
        this.resultBinding(result);
      }, (error) => {
        this.generatingAnswer = false;
        alert('잘못된 처리 입니다. 잠시 후 다시 시도해주세요');
      });
    } else {
      this.generatingAnswer = false;
      alert('지원하지 않는 파일 유형');
    }
  }

  async encodeFileToBase64(file): Promise<any> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  onDragOver(event: any) {
    this.dragging = true;
    event.preventDefault();
  }
}
