import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationService } from '../service/navigation.service';
import { VideoService } from '../service/video.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'video-upload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoUploadComponent implements OnInit, AfterContentInit {
  
  isLoading: any;
  
  resultsFormGroup: FormGroup;
  uploadFormGroup: FormGroup;

  publishVideoClick() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private videoService: VideoService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setupFormGroups() {
    this.resultsFormGroup = this._formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        script: ['', Validators.required],
        tags: ['', Validators.required],
      });
      this.uploadFormGroup = this._formBuilder.group({
        audioFile: [''],
        videoFile: [''],
        imageFile: [''],
      });
  }
  setupObservers() {
    // throw new Error('Method not implemented.');
  }

  onResetMedia() {
    this.navigationService.navigateToResults();
  }
  onResetContent() {
    this.navigationService.navigateToCreateVideo();
  }
}
