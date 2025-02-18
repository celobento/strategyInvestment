package br.com.systemit.strategyInvestment.util;

import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class JsonDateTypeAdapter implements JsonSerializer<Date>, JsonDeserializer<Date> {

    private final SimpleDateFormat simpleDateFormat;

    public JsonDateTypeAdapter(String format) {
        simpleDateFormat = new SimpleDateFormat(format);
    }

    public JsonElement serialize(Date src, Type typeOfSrc, JsonSerializationContext context) {

        String dateFormatAsString = simpleDateFormat.format(src);

        return new JsonPrimitive(dateFormatAsString);
    }

    public Date deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {

        if (!(json instanceof JsonPrimitive)) {
            throw new JsonParseException("The date should be a string value");
        }

        try {
            return simpleDateFormat.parse(json.getAsString());

        } catch (ParseException e) {
            throw new JsonParseException(e);
        }
    }
}
