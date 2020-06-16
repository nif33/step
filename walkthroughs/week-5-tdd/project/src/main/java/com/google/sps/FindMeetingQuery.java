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

public final class FindMeetingQuery {

  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    Collection<String> attendees = request.getAttendees();
    long duration = request.getDuration();
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
}
