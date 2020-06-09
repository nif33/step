package com.google.sps;

public final class Comment {

  private final String id;
  private final String name;
  private final String text;
  private final long timestamp;

  public Comment(String id, String name, String text, long timestamp) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.timestamp = timestamp;
  }
}
