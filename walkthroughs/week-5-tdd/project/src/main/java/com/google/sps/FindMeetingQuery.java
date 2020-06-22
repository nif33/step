// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.ArrayList;
import java.lang.Math;

public final class FindMeetingQuery {

  public Collection<TimeRange> findMeetingTimes(Collection<Event> events, Collection<String> attendees, long duration) {
    Collection<TimeRange> validTimes = new ArrayList<>();
    int meetingWindowStart = TimeRange.START_OF_DAY;

    for(Event event : events){
      if(Collections.disjoint(attendees, event.getAttendees())) { // no overlapping attendees
        continue;
      }

      TimeRange eventTime = event.getWhen();
      if(meetingWindowStart == eventTime.start()) { // consecutive events
        meetingWindowStart = eventTime.end();
        continue;
      }

      int meetingWindowEnd = eventTime.start();
      TimeRange time = TimeRange.fromStartEnd(meetingWindowStart, meetingWindowEnd, false);
      if(time.duration() >= duration) {
        validTimes.add(time);
      }

      if(meetingWindowStart < eventTime.end()) { // update to next available time
        meetingWindowStart = eventTime.end();
      }
    }
    TimeRange time = TimeRange.fromStartEnd(meetingWindowStart, TimeRange.END_OF_DAY, true);
    if(time.duration() >= duration) {
      validTimes.add(time);
    }
    return validTimes;
  }

  public Collection<TimeRange> findOverlapTimes(Collection<TimeRange> mandatoryTimes, Collection<TimeRange> optionalTimes, long duration) {
    Collection<TimeRange> validTimes = new ArrayList<>();
    for(TimeRange optional : optionalTimes) {
      for(TimeRange mandatory : mandatoryTimes) {
        if(mandatory.overlaps(optional)) {
          int start = Math.max(optional.start(), mandatory.start());
          int end = Math.min(optional.end(), mandatory.end());
          if(end == TimeRange.END_OF_DAY) {
            end += 1;
          }
          TimeRange time = TimeRange.fromStartEnd(start, end, false);
          if(time.duration() >= duration) {
            validTimes.add(time);
          }
        }
      }
    }
    return validTimes;
  }

  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    Collection<String> attendees = request.getAttendees();
    Collection<String> optional_attendees = request.getOptionalAttendees();
    long duration = request.getDuration();
    Collection<TimeRange> mandatoryTimes = findMeetingTimes(events, attendees, duration);
    Collection<TimeRange> optionalTimes = findMeetingTimes(events, optional_attendees, duration);
    Collection<TimeRange> overlapTimes = findOverlapTimes(optionalTimes, mandatoryTimes, duration);

    if(overlapTimes.isEmpty() && attendees.isEmpty()) {
      return optionalTimes;
    }
    if(overlapTimes.isEmpty()) {
      return mandatoryTimes;
    }
    return overlapTimes;
  }
}
