1- Explain the Transactional Outbox Pattern and its role in handling race conditions especially in financial operations.
(
1- Preventing "Lost Updates":
By using the Outbox pattern alongside Optimistic Concurrency Control (OCC), you ensure that the message is only generated if the database successfully handles the race condition.

2- Guaranteed Delivery (At-Least-Once):
In finance, failing to send a "Payment Processed" event is catastrophic. Since the Outbox entry is persistent, even if the service crashes after the DB commit, the Relay process will eventually find the record and send it.

3- Idempotency (The Receiver's Role):
The Outbox pattern ensures the message is sent, but the receiver might get it twice (if the Relay crashes after sending but before marking it "Processed"). Financial services handle this by including a Unique Transaction ID in the Outbox message.

)

2- Implement a Notification Micro Service to send an email to users after successful sign-up, and add it to the last demo we discussed.

Gentle Reminder 👇
سلام عليكم جميعاً يا رب نكون بخير 🙏
بفكركم كان مطلوب مننا 2 tasks اخر سيشن:

1- Refactoring API Gateway + adding authentication.

2- Create a npm package for common use, it should be written in typescript.

استأذنكم نبعت هنا ال links تبع ال npm package بحد أقصى بكرة الساعة ٥ 👌
