package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.sps.Marker;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Handles fetching and saving markers data. */
@WebServlet("/markers")
public class MarkerServlet extends HttpServlet {

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  /** Responds with a JSON array containing marker data. */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    ArrayList<Marker> markers = new ArrayList<>();
    Query query = new Query("Marker");
    PreparedQuery results = datastore.prepare(query);

    for (Entity entity : results.asIterable()) {
      double lat = (double) entity.getProperty("lat");
      double lng = (double) entity.getProperty("lng");
      String city = (String) entity.getProperty("city");

      markers.add(new Marker(lat, lng, city));
    }

    Gson gson = new Gson();
    String json = gson.toJson(markers);

    response.setContentType("application/json");
    response.getWriter().println(json);
  }

  /** Accepts a POST request containing a new marker. */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    double lat = 0;
    double lng = 0;
    try {
      lat = Double.parseDouble(request.getParameter("lat"));
      lng = Double.parseDouble(request.getParameter("lng"));
    } catch (NumberFormatException e) {
      response.sendError(HttpServletResponse.SC_NOT_ACCEPTABLE, "coordinate is not able to cast into Double");
    }
    String city = request.getParameter("city");
    city = city.toUpperCase();

    Entity markerEntity = new Entity("Marker");
    markerEntity.setProperty("lat", lat);
    markerEntity.setProperty("lng", lng);
    markerEntity.setProperty("city", city);

    datastore.put(markerEntity);
  }


}
