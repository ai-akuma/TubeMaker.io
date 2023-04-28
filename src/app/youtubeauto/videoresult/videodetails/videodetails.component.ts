import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { VoiceService } from '../../service/voice.service';
import { NavigationService } from '../../service/navigation.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { saveAs } from 'file-saver';

import { GptGeneratedVideo } from '../../model/gpt/gptgeneratedvideo.model';
import { GptService } from '../../service/gpt.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../service/content.service';
import { VideoDuration } from '../../model/videoduration.model';
import { VideoScriptComponent } from '../videoscript/videoscript.component';

@Component({
  selector: 'video-result',
  templateUrl: './videodetails.component.html',
  styleUrls: ['./videodetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoDetailsComponent implements OnInit, AfterContentInit {

  @ViewChild('video-script') videoScriptStep: VideoScriptComponent
  
  scriptFormGroup: FormGroup;
  currentVideoDuration: VideoDuration;

  //debug variable to be removed
  isInDebugMode: boolean = true;
  ////////////////////////////

  progressValue: number = 0;
  progressLabel: string = 'Searching the web...';

  isLinear: any;
  isLoading: boolean = !this.isInDebugMode //should be set to true in production;

  isTitleLoading: boolean = false;
  isTitleOptimizing: boolean = false;

  isDescLoading: boolean = false;
  isDescOptimizing: boolean = false;

  isScriptLoading: boolean = false;
  isScriptOptimizing: boolean = false;

  isTagsLoading: boolean = false;
  isTagsOptimizing: boolean = false;

  resultsFormGroup: FormGroup;
  audioFormGroup: FormGroup;
  videoFormGroup: FormGroup;

  voiceOptions: { name: string, sampleUrl: string }[] = [];

  gptResponseTitle: string = 'Waiting for title...';
  gptResponseDescription: string = 'Waiting for desc...';
  gptResponseScript: string = 'Waiting for script...';
  gptResponseTags: string = 'Waiting for tags...';

  generatedAudio: string;
  generatedAudioIsVisible = false;

  audioFileName: string;
  videoFileName: string;
  imageFileName: string;

  constructor(
    private gptService: GptService,
    private voiceService: VoiceService,
    private contentService: ContentService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.setupObservers();
    this.setupFormGroups();
    
    if (!this.isInDebugMode) { this.voiceService.getVoiceOptions() }
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    
    if (!this.isInDebugMode) { this.gptService.getGptContent(); }
  }

  setupObservers() {
    this.gptService.getProgressSubjectObserver().subscribe((response) => {
      this.progressValue = this.progressValue + response;
      if (this.progressValue === 20) {
        this.progressLabel = 'Researching the competition...';
      } else if (this.progressValue === 40) {
        this.progressLabel = 'Analyzing the market...';
      } else if (this.progressValue === 60) {
        this.progressLabel = 'Predicting trends...';
      } else if (this.progressValue === 80) {
        this.progressLabel = 'Writing the script...';
      } else if (this.progressValue === 100) {
        this.progressLabel = 'Done!';
      }
    });
    this.gptService.getCompleteResultsSubjectObserver().subscribe(
      (response: GptGeneratedVideo) => setTimeout(() => {
        this.isLoading = false;
        this.videoScriptStep.parentIsLoading = this?.isLoading;

        console.log(
          '🚀 ~ file: videoresult.component.ts:40 ~ VideoDetailsComponent ~ this.posterService.getResultsObserver.subscribe ~ response:',
          response
        );
        this.resultsFormGroup.setValue({
          title: response.title.replace('"', '').trim(),
          description: response.description.trim(),
          script: response.script.trim(),
          tags: response.tags.join(', ').trim(),
        });
      }, 1000)
    );
    this.gptService.getTitleSubjectObserver().subscribe((response) => {
      this.isTitleLoading = false;
      this.resultsFormGroup.patchValue({ title: response.replace('"', '').trim() })
    });
    this.gptService.getDescriptionSubjectObserver().subscribe((response) => {
      this.isDescLoading = false;
      this.resultsFormGroup.patchValue({ description: response.trim() })
    });
    this.gptService.getTagsSubjectObserver().subscribe((response) => {  
      this.isTagsLoading = false;
      this.resultsFormGroup.patchValue({ tags: response.join(', ').trim() })
    });
    this.voiceService.getVoiceOptionsObserver().subscribe((response) => {
      this.voiceOptions = response;
    });
    this.voiceService.getTextToSpeechObserver().subscribe((response) => {
      if (response !== '') {
        this.generatedAudio = response;
        this.generatedAudioIsVisible = true;
      }
    });
  }

  setupFormGroups() {
    this.resultsFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      script: ['', Validators.required],
      tags: ['', Validators.required],
    });
    this.audioFormGroup = this._formBuilder.group({
      selectedVoice: [''],
      audioFile: ['']
    });
    //TODO we will neeed this to be updated for our uploaded files held across services
    this.videoFormGroup = this._formBuilder.group({ 
      videoFile: ['', Validators.required],
      imageFile: ['', Validators.required],
     });
     this.scriptFormGroup = this._formBuilder.group({
      introduction: ['', Validators.required],
      mainContent: ['', Validators.required],
      conclusion: ['', Validators.required],
      questions: [''],
      opinions: [''],
      caseStudies: [''],
      actionables: [''],
    });
  }

  onScriptFormGroupChange(childFormGroup: FormGroup) {
    this.scriptFormGroup = childFormGroup;
  }

  rerollTitle() {
    this.isTitleLoading = true;
    this.resultsFormGroup.patchValue({ title: 'Please wait...' })
    this.gptService.getIsolatedTitle();
  }

  optimizeTitle() {
    throw new Error('Method not implemented.');
  }

  rerollDescription() {
    this.isDescLoading = true;
    this.resultsFormGroup.patchValue({ description: 'Please wait...' })
    this.gptService.getIsolatedDescription();
  }
  
  optimizeDesc() {
    throw new Error('Method not implemented.');
  }

  rerollTags() {
    this.isTagsLoading = true;
    this.resultsFormGroup.patchValue({ tags: 'Please wait...' })
    this.gptService.getIsolatedTags();
  }

  optimizeTags() {
    throw new Error('Method not implemented.');
  }

  downloadTextFile() {
    this.gptService.getScriptForDownload().subscribe((blobItem) => {
      saveAs(blobItem.blob, blobItem.filename);
    });
  }
  
  onAudioPicked(event: Event) {
    const htmlTarget = (event?.target as HTMLInputElement)
    if (htmlTarget !== null) {
      if (htmlTarget.files !== null && htmlTarget.files.length > 0) {
        const file = htmlTarget.files[0]
        this.audioFormGroup.patchValue({ audioFile: file.name });
        this.audioFileName = file.name;
        this.contentService.updateAudioFile(file);
      }
    }
  }  

  onVideoPicked(event: Event) {
    const htmlTarget = (event?.target as HTMLInputElement)
    if (htmlTarget !== null) {
      if (htmlTarget.files !== null && htmlTarget.files.length > 0) {
        const file = htmlTarget.files[0]
        this.videoFormGroup.patchValue({ videoFile: file.name });
        this.videoFileName = file.name;
        this.contentService.updateVideoFile(file);
      }
    }
  }

  onImagePicked(event: Event) {
    const htmlTarget = (event?.target as HTMLInputElement)
    if (htmlTarget !== null) {
      if (htmlTarget.files !== null && htmlTarget.files.length > 0) {
        const file = htmlTarget.files[0]
        this.videoFormGroup.patchValue({ imageFile: file.name });
        this.imageFileName = file.name;
        this.contentService.updateImageFile(file);
      }
    }
  }

  generateTextToSpeech() {
    const scriptValue = this.resultsFormGroup.get('script')?.value;
    if (scriptValue === null || scriptValue === '') {
      alert('Please enter a script before generating audio');
      return;
    }
    this.generatedAudio = "";
    this.generatedAudioIsVisible = false;

    const selectedVoiceControl = this.audioFormGroup.get('selectedVoice')?.value;
    this.voiceService.generateTextToSpeech(
      selectedVoiceControl.value, 
      scriptValue
    );
  }

  descriptButtonClicked() {
    ///https://media.play.ht/full_-NTbzfZeyW_-qJQLq4Wg.mp3?generation=1682150707643372&alt=media
    window.open('https://web.descript.com/', '_blank');
  }

  goToReview() {
    this.navigationService.navigateToUploadVideo();
  }

  onReset() {
    this.navigationService.navigateToCreateVideo();
  }
}