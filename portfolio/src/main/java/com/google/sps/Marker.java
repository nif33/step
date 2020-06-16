package com.google.sps;

public final class Marker {

  private final double lat;
  private final double lng;
  private final String city;

  public Marker(double lat, double lng, String city) {
    this.lat = lat;
    this.lng = lng;
    this.city = city;
  }
}
