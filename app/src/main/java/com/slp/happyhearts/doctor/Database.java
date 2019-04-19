package com.slp.happyhearts.doctor;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.widget.Toast;

import com.slp.happyhearts.Config;
import com.slp.happyhearts.doctor.adapters.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Database
{
    private SQLiteDatabase database;
    private Context context;
    public Database(Context context)
    {
        this.context=context;
        database = context.openOrCreateDatabase(Config.HOSPITAL_LOCAL_DATABASE,context.MODE_PRIVATE,null);
        database.execSQL("CREATE TABLE IF NOT EXISTS history(transactionId VARCHAR(200) primary key,uid VARCHAR(100),StaffName VARCHAR(100),Address VARCHAR(100),ChronicDisease VARCHAR(100),Disease VARCHAR(200),DiseaseType VARCHAR(200),DiseaseCategory VARCHAR(200),DiseaseSubCategory VARCHAR(200),allergies VARCHAR(200),AlcoholConsumption VARCHAR(5),SmokingHabits VARCHAR(5),medicines VARCHAR(500),tests VARCHAR(500),Date VARCHAR(20),claimStatus VARCHAR(30),HospitalName VARCHAR(1000));");
    }

    public void insert(String transactionId,String uid,String StaffName,String Address,String ChronicDisease,String Disease,String DiseaseType,String DiseaseCategory,String DiseaseSubCategory,String allergies,String AlcoholConsumption,String SmokingHabits,String medicines,String tests,String Date,String claimStatus,String HospitalName)
    {
        if (!isExist(transactionId)) {
            database.execSQL("INSERT INTO history VALUES('" + transactionId + "','" + uid + "','" + StaffName + "','" + Address + "','" + ChronicDisease + "','" + Disease + "','" + DiseaseType + "','" + DiseaseCategory + "','" + DiseaseSubCategory + "','" + allergies + "','" + AlcoholConsumption + "','" + SmokingHabits + "','" + medicines + "','" + tests + "','" + Date + "','"+claimStatus+"','"+HospitalName+"');");
        }
    }

    public boolean isExist(String id)
    {
        Cursor resultSet = database.rawQuery("Select * from history where transactionId='"+id+"'",null);
        resultSet.moveToFirst();
        if(resultSet.getCount()==0)
        {
           return false;
        }
       return true;
    }

    public void getData(String uid,List<Map<String,String>> items)
    {
        Cursor resultSet = database.rawQuery("Select * from history where uid='"+uid+"';",null);
        resultSet.moveToFirst();
        while(!resultSet.isAfterLast())
        {
            Map<String,String> data=new HashMap<String,String>();
            data.put("transactionId",resultSet.getString(0));
            data.put("uid",resultSet.getString(1));
            data.put("StaffName",resultSet.getString(2));
            data.put("Address",resultSet.getString(3));
            data.put("ChronicDisease",resultSet.getString(4));
            data.put("Disease",resultSet.getString(5));
            data.put("DiseaseType",resultSet.getString(6));
            data.put("DiseaseCategory",resultSet.getString(7));
            data.put("DiseaseSubCategory",resultSet.getString(8));
            data.put("allergies",resultSet.getString(9));
            data.put("AlcoholConsumption",resultSet.getString(10));
            data.put("SmokingHabits",resultSet.getString(11));
            data.put("medicines",resultSet.getString(12));
            data.put("tests",resultSet.getString(13));
            data.put("Date",resultSet.getString(14));
            data.put("claimStatus",resultSet.getString(15));
            data.put("HospitalName",resultSet.getString(16));
            items.add(data);
            resultSet.moveToNext();
        }

    }

    public void close()
    {
        database.close();
    }
}
