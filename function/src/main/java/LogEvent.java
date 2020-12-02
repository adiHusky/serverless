import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SNSEvent;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class LogEvent implements RequestHandler<SNSEvent, Object> {
    public Object handleRequest(SNSEvent snsEvent, Context context) {
        String timeStamp = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(Calendar.getInstance().getTime());
        context.getLogger().log("Invocation has been started: " + timeStamp);
        context.getLogger().log("Request is NULL: " + (snsEvent==null));
        context.getLogger().log("Number of Records are: " + (snsEvent.getRecords().size()));
        String record = snsEvent.getRecords().get(0).getSNS().getMessage();
        context.getLogger().log("Record Message is: " + record);
        timeStamp = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(Calendar.getInstance().getTime());
        context.getLogger().log("Invocation is completed: " + timeStamp);

        return null;
    }
}