package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Transaction;
import java.io.IOException;
import java.util.ConcurrentModificationException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that deletes comments data */
@WebServlet("/report")
public class ReportServlet extends HttpServlet {

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  public int incrementReportCount(String id, int numRetries) {
    Transaction transaction = datastore.beginTransaction();
    try {
      try {
        Key commentKey = KeyFactory.stringToKey(id);
        Entity commentEntity = datastore.get(commentKey);
        long numReports = (long) commentEntity.getProperty("numReports");
        numReports++;
        commentEntity.setProperty("numReports", numReports);
        datastore.put(transaction, commentEntity);
        transaction.commit();
      } catch (EntityNotFoundException e) {
        System.err.println("Key is not an entity in the database");
      }
      return 0;
    } catch (ConcurrentModificationException e) {
      if(numRetries == 0) {
        throw e;
      }
      return --numRetries;
    } finally {
      if(transaction.isActive()) {
        transaction.rollback();
      }
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String id = request.getParameter("id");
    int numRetries = 3;
    while(numRetries > 0) {
      numRetries = incrementReportCount(id, numRetries);
    }
  }
}
