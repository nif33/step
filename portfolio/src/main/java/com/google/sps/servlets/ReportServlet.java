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

  public boolean incrementReportCount(String id, Transaction transaction) throws EntityNotFoundException, ConcurrentModificationException {
    Key commentKey = KeyFactory.stringToKey(id);
    Entity commentEntity = datastore.get(commentKey);
    if(commentEntity == null) {
      return false;
    }
    long numReports = (long) commentEntity.getProperty("numReports");
    numReports++;
    commentEntity.setProperty("numReports", numReports);
    datastore.put(transaction, commentEntity);
    transaction.commit();
    return true;
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Transaction transaction = datastore.beginTransaction();
    String id = request.getParameter("id");
    for(int numRetries = 3; numRetries > 0; numRetries--) {
      try {
        incrementReportCount(id, transaction);
        break;
      } catch (EntityNotFoundException e) {
        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Key was not found in the database.");
      } catch (ConcurrentModificationException e) {
        if(numRetries == 0) {
          response.sendError(HttpServletResponse.SC_CONFLICT, "Too many concurrent modification attempts.");
        }
      } finally {
        if(transaction.isActive()) {
          transaction.rollback();
        }
      }
    }
  }
}
