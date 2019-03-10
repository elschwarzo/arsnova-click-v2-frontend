import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { checkABCDOrdering } from '../../../lib/checkABCDOrdering';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { MessageProtocol } from '../../../lib/enums/Message';
import { IDuplicateQuiz } from '../../../lib/interfaces/quizzes/IDuplicateQuiz';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-quiz-rename',
  templateUrl: './quiz-rename.component.html',
  styleUrls: ['./quiz-rename.component.scss'],
})
export class QuizRenameComponent implements OnInit {
  public static TYPE = 'QuizRenameComponent';
  public isQuiznameAvailable: boolean;
  public isQueringQuizname: boolean;
  public quizName = '';
  public isQuiznameMalformed: boolean;

  constructor(
    public readonly fileUploadService: FileUploadService,
    private readonly footerBarService: FooterBarService,
    private readonly router: Router,
    private readonly quizApiService: QuizApiService,
  ) {
    this.footerBarService.TYPE_REFERENCE = QuizRenameComponent.TYPE;
    this.footerBarService.replaceFooterElements([this.footerBarService.footerElemBack]);
  }

  public sendRecommendation(duplicateQuiz: IDuplicateQuiz, renameRecommendation: string): void {
    const reader = new FileReader();
    const file: File = <File>this.fileUploadService.renameFilesQueue.getAll('uploadFiles[]').find((uploadedFile) => {
      return (<File>uploadedFile).name === duplicateQuiz.fileName;
    });
    reader.addEventListener<'load'>('load', () => {
      const quizData: QuizEntity = JSON.parse(reader.result.toString());
      quizData.name = renameRecommendation;
      const blob = new Blob([JSON.stringify(quizData)], { type: 'application/json' });
      this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, duplicateQuiz.fileName);
      this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
    });
    reader.readAsText(file);
  }

  public checkIsQuizNameAvailable(): void {
    this.isQuiznameAvailable = false;
    this.isQuiznameMalformed = false;

    const name = this.quizName.trim().toLowerCase();
    if (name.length < 3 || name.startsWith('demo quiz') || checkABCDOrdering(name)) {
      this.isQuiznameMalformed = true;
      return;
    }

    this.isQueringQuizname = true;
    this.quizApiService.getQuizStatus(this.quizName).subscribe(status => {
      this.isQueringQuizname = false;
      this.isQuiznameAvailable = status.step === MessageProtocol.Unavailable;
    });
  }

  public sendQuizName(duplicateQuiz: IDuplicateQuiz): void {
    this.sendRecommendation(duplicateQuiz, this.quizName);
  }

  public ngOnInit(): void {
    if (!this.fileUploadService.renameFilesQueue) {
      this.router.navigate(['/']);
    }
  }
}
