package br.com.systemit.strategyInvestment.util;


import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class JsonUtil {


    @SuppressWarnings("unchecked")
    public static <T> T jsonToObject(Class< ? > classe, String jsonString) {

        Gson gson = new Gson();

        return (T) gson.fromJson(jsonString, classe);

    }

    /**
     * Converte um array de objetos json em uma lista especifica
     * @param arrayObjectsJson	Array de objetos json. Ex. [{nome='ythalo'}, {nome='juliana'}]
     * @return	{@link List<T>}
     */
    public static <T> List<T> jsonArrayToListObject(String arrayObjectsJson) {

        List<T> result = new ArrayList<T>();

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(new TypeToken<Date>() { } .getType(), new JsonDateTypeAdapter("dd-MM-yyyy HH:mm:ss"))
                .create();

        TypeToken<List<T>> typeToken = new TypeToken<List<T>>() { };
        Type collectionType = typeToken.getType();

        List<T> listObjects = gson.fromJson(arrayObjectsJson, collectionType);

        for (T obj : listObjects) {
            result.add(obj);
        }

        return result;
    }

    public static <E> String objectToJson(Object object) {

        Gson gson = new Gson();

        String userJSONString = gson.toJson(object);

        return userJSONString;

    }

}