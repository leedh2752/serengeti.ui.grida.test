import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AgreeComponent } from '../agree/agree.component';
import { GridaService } from '../service/grida.service';
import { DomSanitizer } from '@angular/platform-browser';
import {Router} from '@angular/router';
import { saveAs } from 'file-saver';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

declare var MediaRecorder: any;

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  public isRecording = false;
  public mediaRecorder;
  public audioArray = [];
  public image = null;
  public createData = null;
  public createImage = null;
  public insertImage = true;
  public imageType = 'realistic';

  sttRequest;

  generateImage: boolean = false;
  generatingImage: boolean = false;
  generateComplete: boolean = false;
  spinnering: boolean = false;

  runCount;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  promptCtrl = new FormControl();
  filteredPrompts: Observable<string[]>;
  prompts: string[] = [];
  allPrompts: string[];

  @ViewChild('promptInput', {static: false}) promptInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    private dialog: MatDialog,
    private gridaService: GridaService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    // this.filteredPrompts = this.promptCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((prompt: string | null) => prompt ? this._filter(prompt) : this.allPrompts.slice()));
  }

  ngOnInit() {
    this.getRunCount();
  }

  public generateImageToVoice() {
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.timeout();
    }
  }
  public changeMode(value: string) {
    this.imageType = value;
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

  public timeout() {
    this.generatingImage = true;
    setTimeout(() => {
      this.mediaRecorder.stop();
      setTimeout(() => {
        this.stopRecording();
      }, 100);
    }, 400);
  }

  public stopRecording() {
    const inputBlob = new Blob(this.audioArray, {type: 'video/webm'});

    this.gridaService.generateImageToVoice(inputBlob, this.imageType).subscribe(result => {
      this.generatingImage = false;

      const value = JSON.parse(atob(result.data[0].result));
      if (value.sttText === 'null') {
        alert('음성 인식 오류입니다. 다시 시도해주세요.');
        this.mediaRecorder = null;
        this.audioArray = [];
        this.isRecording = false;

        return;
      }

      if (value.imageContent === 'null') {
        alert('이미지 생성 오류입니다. 다시 시도해주세요.');
        this.mediaRecorder = null;
        this.audioArray = [];
        this.isRecording = false;

        return;
      }
      this.sttRequest = value;
      this.image = this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64, ' + value.imageContent);
      this.createImageFile(this.sttRequest.imageContent);

      // 리턴 받은 audioContent 변환 후 play
      // const valueAudioBinaryString = atob(value.audioContent);
      // const valueAudioBytes = new Uint8Array(valueAudioBinaryString.length);
      // for (let i = 0; i < valueAudioBinaryString.length; i++) {
      //   valueAudioBytes[i] = valueAudioBinaryString.charCodeAt(i);
      // }
      // const valueAudioBlob = new Blob([valueAudioBytes.buffer], {type: 'audio/mp4'});
      // const valueAudio = new Audio(URL.createObjectURL(valueAudioBlob));
      // valueAudio.play();

      // media 변수 초기화
      this.mediaRecorder = null;
      this.audioArray = [];
      this.isRecording = false;
      this.insertImage = true;

      this.generateImage = true;
      this.addRunCount();
    });
  }

  public retry() {
    this.generateImage = false;
    this.generateComplete = false;
    this.image = null;
    this.getRunCount();
  }

  // create시 mock데이터로 입력
  public create() {
    const registrationRequest = {
      userName: '',
      userPhone: '',
      userEmail: '',
      userOrganization: '',
      prompt: this.sttRequest.sttText,
      translatedPrompt: this.sttRequest.translatedText,
    };
    this.spinnering = true;
    this.gridaService.imageRegistration(registrationRequest, this.createImage).subscribe(res => {
      this.spinnering = false;
      this.insertImage = false;
      this.createData = res.data;
      alert('그림 등록이 완료되었습니다.');
    }, error => {
      this.spinnering = false;
      alert('시스템 오류. 관리자에게 문의해주세요');
    });
  }

  public dataURItoBlob(dataURI) {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  public createImageFile(blobImage) {
    const imageBlob = this.dataURItoBlob(blobImage);
    const imageName = this.sttRequest.translatedText;
    this.createImage = new File([imageBlob], imageName, { type: 'image/png' });
  }

  // 임시 다운로드 기능 생성
  public download() {
    const data = {
      prompt: this.sttRequest.sttText,
      translatedPrompt: this.sttRequest.translatedText
    };
    this.gridaService.imageRegistration(data, this.createImage).subscribe(res => {
      this.spinnering = false;
      // saveAs(this.createImage, this.sttRequest.sttText + '.png');
      alert('그림 등록이 완료되었습니다. 리스트로 이동합니다.');
      this.router.navigate(['list']);
    }, error => {
      this.spinnering = false;
      alert('시스템 오류입니다. 관리자에게 문의해주세요');
    });
    // const dialog = this.dialog.open(AgreeComponent, {
    //   data: this.sttRequest,
    //   disableClose: true,
    // });
    //
    // dialog.componentInstance.userRegistrationEvent.subscribe(res => {
    // });
    //
    // dialog.afterClosed().subscribe(res => {
    //   if (res === null) {
    //     this.spinnering = false;
    //     return;
    //   }
    //   this.spinnering = true;
    //
    //   if (!this.createData) { // 그림을 등록하기 전에 다운로드를 눌렀을때
    //     this.gridaService.imageRegistration(res, this.createImage).subscribe(res => {
    //       this.spinnering = false;
    //       saveAs(this.createImage, this.sttRequest.sttText + '.png');
    //       alert('그림 등록이 완료되었습니다. 리스트로 이동합니다.');
    //       this.router.navigate(['list']);
    //     }, error => {
    //       this.spinnering = false;
    //       alert('시스템 오류입니다. 관리자에게 문의해주세요');
    //     });
    //   } else { // 그림을 등록한 후 다운로드 했을 때
    //     this.gridaService.updatePost(this.createData.id, res).subscribe(res => {
    //       this.spinnering = false;
    //       saveAs(this.createImage, this.sttRequest.sttText + '.png');
    //       this.router.navigate(['list']);
    //     }, error => {
    //       this.spinnering = false;
    //       alert('시스템 오류입니다. 관리자에게 문의해주세요');
    //     });
    //   }
    // });
  }

  public addRunCount() {
    this.gridaService.addRunCount().subscribe(res => {
      this.getRunCount();
    });
  }

  public getRunCount() {
    this.gridaService.getRunCount().subscribe(res => {
      this.runCount = res.count;
    });
  }

  // add(event: MatChipInputEvent): void {
  //   // Add prompt only when MatAutocomplete is not open
  //   // To make sure this does not conflict with OptionSelected Event
  //   if (!this.matAutocomplete.isOpen) {
  //     const input = event.input;
  //     const value = event.value;
  //
  //     // Add our prompt
  //     if ((value || '').trim()) {
  //       this.prompts.push(value.trim());
  //     }
  //
  //     // Reset the input value
  //     if (input) {
  //       input.value = '';
  //     }
  //
  //     this.promptCtrl.setValue(null);
  //   }
  // }
  //
  // remove(prompt: string): void {
  //   const index = this.prompts.indexOf(prompt);
  //
  //   if (index >= 0) {
  //     this.prompts.splice(index, 1);
  //   }
  // }
  //
  // selected(event: MatAutocompleteSelectedEvent): void {
  //   this.prompts.push(event.option.viewValue);
  //   this.promptInput.nativeElement.value = '';
  //   this.promptCtrl.setValue(null);
  // }
  //
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //
  //   return this.allPrompts.filter(prompt => prompt.toLowerCase().indexOf(filterValue) === 0);
  // }

}
