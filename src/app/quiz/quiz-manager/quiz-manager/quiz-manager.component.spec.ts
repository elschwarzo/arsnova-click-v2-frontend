import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { availableQuestionTypes } from '../../../../lib/available-question-types';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { FooterModule } from '../../../footer/footer.module';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { TrackingMockService } from '../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../service/tracking/tracking.service';
import { UserService } from '../../../service/user/user.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { SharedModule } from '../../../shared/shared.module';

import { QuizManagerComponent } from './quiz-manager.component';

describe('QuizManagerComponent', () => {
  let component: QuizManagerComponent;
  let fixture: ComponentFixture<QuizManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), HttpClientTestingModule, SharedModule, RouterTestingModule, HttpClientModule, FooterModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        UserService, IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService,
      ],
      declarations: [QuizManagerComponent],
    }).compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(QuizManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(QuizManagerComponent.TYPE).toEqual('QuizManagerComponent');
  }));

  describe('#addQuestion', () => {
    it('should add a question', inject([QuizService], (quizService: QuizService) => {
      const id = availableQuestionTypes[0];

      quizService.quiz.questionList.splice(0, quizService.quiz.questionList.length);

      expect(quizService.quiz.questionList.length).toEqual(1);
      expect(quizService.quiz.questionList[0].TYPE).toEqual(id);
    }));

    it('should not add an invalid question', inject([QuizService], (quizService: QuizService) => {
      const id = 'NotExisting';

      quizService.quiz.questionList.splice(0, quizService.quiz.questionList.length);

      expect(quizService.quiz.questionList.length).toEqual(0);
    }));
  });

  describe('#moveQuestionUp', () => {
    it('should decrement the index of a question in the questionlist by 1', inject([QuizService], (quizService: QuizService) => {
      const question = quizService.quiz.questionList[1];
      component.moveQuestionUp(1);
      expect(quizService.quiz.questionList[0]).toEqual(question);
    }));

    it('should not decrement the index of a question in the questionlist if it is at first position',
      inject([QuizService], (quizService: QuizService) => {
        const question = quizService.quiz.questionList[0];
        component.moveQuestionUp(0);
        expect(quizService.quiz.questionList[0]).toEqual(question);
      }));
  });

  describe('#moveQuestionDown', () => {
    it('should increment the index of a question in the questionlist by 1', inject([QuizService], (quizService: QuizService) => {
      const question = quizService.quiz.questionList[1];
      component.moveQuestionDown(1);
      expect(quizService.quiz.questionList[2]).toEqual(question);
    }));

    it('should not increment the index of a question in the questionlist if it is at the last position',
      inject([QuizService], (quizService: QuizService) => {
        const lastIndex = quizService.quiz.questionList.length - 1;
        const question = quizService.quiz.questionList[lastIndex];
        component.moveQuestionDown(lastIndex);
        expect(quizService.quiz.questionList[lastIndex]).toEqual(question);
      }));
  });
});
