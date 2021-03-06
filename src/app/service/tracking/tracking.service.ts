import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { TrackingCategoryType } from '../../lib/enums/enums';
import { ITrackClickEvent } from '../../lib/interfaces/tracking/ITrackClickEvent';
import { ITrackConversionEvent } from '../../lib/interfaces/tracking/ITrackConversionEvent';
import { ITrackEvent } from '../../lib/interfaces/tracking/ITrackEvent';
import { ArsnovaClickAngulartics2Piwik } from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {

  constructor(private angulartics2: Angulartics2, private angulartics2Piwik: ArsnovaClickAngulartics2Piwik) {
  }

  public trackEvent({ category, action, label, value, customDimensions = {} }: ITrackEvent): void {
    try {
      this.angulartics2Piwik.setUserProperties(customDimensions);
      this.angulartics2.eventTrack.next({
        action,
        properties: {
          category: TrackingCategoryType[category].toLowerCase(),
          label,
          value,
        },
      });
    } catch (ex) {
      if (!(ex instanceof ReferenceError)) {
        console.error(ex.message);
      }
    }
  }

  public trackConversionEvent({ action, label = '' }: ITrackConversionEvent): void {
    this.trackEvent({
      category: TrackingCategoryType.Conversion,
      action,
      label,
    });
  }

  public trackClickEvent({ action, label, value, customDimensions = {} }: ITrackClickEvent): void {
    this.trackEvent({
      category: TrackingCategoryType.Click,
      action,
      label,
      value,
      customDimensions,
    });
  }

}
