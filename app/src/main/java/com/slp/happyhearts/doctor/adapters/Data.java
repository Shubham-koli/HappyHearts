package com.slp.happyhearts.doctor.adapters;

import com.slp.happyhearts.Config;

import java.util.List;
import java.util.Map;

public class Data
{
    public static String PATIENT_ID;
    public static String PATIENT_NAME;
    public static String STAFF_NAME;
    public static  String addPatientRecordURL = "http://" + Config.SERVER_ADDRESS + "/newtreatment";
    public static String insuranceClaimDetailsURL="http://" + Config.SERVER_ADDRESS + "/viewdetails";
}
