
# Stage 1

## Overview

This notification system allows logged-in users to receive and manage notifications.

---

## Authentication

All APIs require JWT authentication.

**Header**

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 1. Get All Notifications

**Endpoint**

```http
GET /api/notifications
```

**Response**

```json
{
  "success": true,
  "notifications": [
    {
      "id": "1",
      "title": "Welcome",
      "message": "Welcome to our platform",
      "type": "info",
      "isRead": false
    }
  ]
}
```

---

## 2. Create Notification

**Endpoint**

```http
POST /api/notifications
```

**Request**

```json
{
  "title": "Assignment",
  "message": "Assignment submitted",
  "type": "success"
}
```

**Response**

```json
{
  "success": true,
  "message": "Notification created"
}
```

---

## 3. Mark Notification as Read

**Endpoint**

```http
PATCH /api/notifications/:id/read
```

**Response**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 4. Delete Notification

**Endpoint**

```http
DELETE /api/notifications/:id
```

**Response**

```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## Notification Schema

```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "info | success | warning | error",
  "isRead": false,
  "createdAt": "Date"
}
```

---

## Real-Time Notifications

Real-time notifications can be implemented using **WebSocket (Socket.IO)**. When a new notification is created, the server sends it instantly to the logged-in user without refreshing the page.



# Stage 2

## Database Choice

I would use MongoDB because it works well with JSON data and is easy to use with Node.js and Express. It is also flexible if we need to add more fields later.

---

## Notification Schema

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "string",
  "message": "string",
  "type": "info | success | warning | error",
  "isRead": false,
  "createdAt": "Date"
}
```

---

## Possible Problems

### 1. Large Number of Notifications
As notifications increase, fetching data can become slower.

**Solution:** Add indexes on `userId` and `createdAt`.

### 2. Storage Size
Old notifications will keep increasing the database size.

**Solution:** Delete or archive old notifications after a certain period.

### 3. High Traffic
Many users may receive notifications at the same time.

**Solution:** Use WebSockets for real-time updates and scale the database if needed.

---

## MongoDB Queries

### Create Notification

```javascript
db.notifications.insertOne({
  userId: ObjectId("USER_ID"),
  title: "Welcome",
  message: "Welcome to our platform",
  type: "info",
  isRead: false
})
```

### Get All Notifications

```javascript
db.notifications.find({ userId: ObjectId("USER_ID") })
```

### Mark as Read

```javascript
db.notifications.updateOne(
  { _id: ObjectId("NOTIFICATION_ID") },
  { $set: { isRead: true } }
)
```

### Delete Notification

```javascript
db.notifications.deleteOne({
  _id: ObjectId("NOTIFICATION_ID")
})



# Stage 3

## Is the query correct?

Yes, the query is correct because it fetches all unread notifications for a particular student and shows the latest notifications first.

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

## Why is it slow?

The table has around **5 million notifications**. If there is no proper index, the database has to check many rows before finding the required data, which makes the query slow.

## How can it be improved?

Create a composite index on the columns used in the query.

```sql
CREATE INDEX idx_notification
ON notifications(studentID, isRead, createdAt);
```

This helps the database find the required notifications much faster.

## Computation Cost

- Without index: **O(n)** (checks many rows)
- With index: **O(log n)** (search is much faster)

## Should we add indexes on every column?

No.

Adding indexes on every column is not a good idea because it uses more storage and slows down insert and update operations. We should create indexes only on columns that are frequently used in `WHERE`, `JOIN`, or `ORDER BY` clauses.

## SQL Query

Find all students who received **Placement** notifications in the last 7 days.

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```


# Stage 4

## Solution

Instead of fetching notifications from the database on every page load, I would use the following approaches.

### 1. Pagination

Load only a limited number of notifications (for example, 20 at a time) instead of loading all notifications.

**Tradeoff:** Improves performance, but users need to click "Load More" or scroll to see older notifications.

---

### 2. Caching

Store frequently accessed notifications in a cache like Redis. The application checks the cache first before querying the database.

**Tradeoff:** Faster response time, but cache needs to be updated when notifications change.

---

### 3. Real-Time Notifications

Use WebSocket (Socket.IO) to send new notifications instantly instead of repeatedly checking the database.

**Tradeoff:** Better user experience, but maintaining WebSocket connections uses more server resources.

---

### 4. Database Indexing

Create indexes on commonly searched columns like `studentID`, `isRead`, and `createdAt`.

**Tradeoff:** Faster queries, but inserts and updates become slightly slower because indexes also need to be updated.

---

## Conclusion

Using pagination, caching, WebSockets, and proper indexing together will reduce database load and improve the overall performance of the notification system.



# Stage 5

## Shortcomings

The current implementation sends emails and saves notifications one by one. If sending an email fails in the middle (for example, for 200 students), some students will receive the notification while others won't. It is also slow because each task waits for the previous one to finish.

## How I would improve it

- Save all notifications to the database first.
- Use a queue (like RabbitMQ or Kafka) to send emails in the background.
- If an email fails, retry only for those students instead of sending emails to everyone again.
- Send in-app notifications separately using WebSocket.

This makes the system faster and more reliable.

## Should saving to the database and sending emails happen together?