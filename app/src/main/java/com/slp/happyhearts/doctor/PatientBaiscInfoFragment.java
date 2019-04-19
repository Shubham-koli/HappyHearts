package com.slp.happyhearts.doctor;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.slp.happyhearts.Config;
import com.slp.happyhearts.R;
import com.slp.happyhearts.doctor.adapters.Data;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class PatientBaiscInfoFragment extends Fragment
{
    private RequestQueue volleyRequestQueue;
    private TextView name_tv, address_tv, gender_tv, dob_tv, bloodgroup_tv, age_tv, organ_doner_tv, weight_tv, ration_card_tv, height_tv,
            chronic_desease_tv, last_diagonised_desease_tv, on_date_tv, symptomps_tv;

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.patient_basic_info_doctor_fragnent, container, false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        volleyRequestQueue = Volley.newRequestQueue(getContext());
        name_tv = (TextView) view.findViewById(R.id.name_tv);
        address_tv = (TextView) view.findViewById(R.id.address_tv);
        gender_tv = (TextView) view.findViewById(R.id.gender_tv);
        dob_tv = (TextView) view.findViewById(R.id.dob_tv);
        bloodgroup_tv = (TextView) view.findViewById(R.id.blood_group_tv);
        age_tv = (TextView) view.findViewById(R.id.age_tv);
        organ_doner_tv = (TextView) view.findViewById(R.id.organ_donor_tv);
        weight_tv = (TextView) view.findViewById(R.id.weight_tv);
        ration_card_tv = (TextView) view.findViewById(R.id.ration_card_tv);
        height_tv = (TextView) view.findViewById(R.id.height_tv);
        chronic_desease_tv = (TextView) view.findViewById(R.id.chronic_disease_tv);
        last_diagonised_desease_tv = (TextView) view.findViewById(R.id.last_digonasis_tv);
        on_date_tv = (TextView) view.findViewById(R.id.digonasis_date_tv);
        symptomps_tv = (TextView) view.findViewById(R.id.symptomps_tv);

    }

    void getData() {
        final ProgressDialog mDialog = new ProgressDialog(getContext());
        mDialog.setCancelable(false);
        mDialog.setMessage("Getting patient data...");
        mDialog.show();
        String url = "http://" + Config.SERVER_ADDRESS + "/getpatient";
        Map<String, String> params = new HashMap<String, String>();
        params.put("Hospital_ID", Config.HOSPITAL_ID);
        params.put("Staff_ID", Config.DOCTOR_ID);
        params.put("AdharNo", Data.PATIENT_ID);

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, new JSONObject(params), new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                try {
                    if (jsonObject.getString("status").equals("200")) {
                        mDialog.dismiss();
                        name_tv.setText("Name : " + jsonObject.get("firstName").toString() + " " + jsonObject.get("lastName").toString());
                        address_tv.setText("Address : " + jsonObject.get("address").toString());
                        gender_tv.setText("Gender : " + jsonObject.getString("Gender"));
                        dob_tv.setText("DOB : " + jsonObject.getString("Dob"));
                        bloodgroup_tv.setText("Blood Group : " + jsonObject.getString("BloodGroup"));
                        Date dob = new SimpleDateFormat("dd-mm-yyyy").parse(jsonObject.getString("Dob"));
                        Date current = new Date();
                        int years = current.getYear() - dob.getYear();
                        age_tv.setText("Age : " + Integer.toString(years));
                        organ_doner_tv.setText("Organ Doner : NA");
                        weight_tv.setText("Weight : 65");
                        ration_card_tv.setText("Ration Card : NA");
                        height_tv.setText("Height : 5.8 ft");

                    }
                    else
                    {
                        Toast.makeText(getContext(), "Unauthorized to access record of this patient", Toast.LENGTH_LONG).show();
                        mDialog.dismiss();
                    }
                } catch (Exception e)
                {
                    mDialog.dismiss();
                    Toast.makeText(getContext(), e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                mDialog.dismiss();
                Toast.makeText(getContext(), error.getLocalizedMessage(), Toast.LENGTH_LONG).show();
            }
        }) {
            @Override
            protected Map<String, String> getParams() {
                return null;
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/JSON");
                return params;
            }
        };
        volleyRequestQueue.add(request);
        getDeseaseData();
    }

    void getDeseaseData()
    {
        final ProgressDialog mDialog = new ProgressDialog(getContext());
        mDialog.setCancelable(false);
        mDialog.setMessage("Getting patient data...");
        mDialog.show();
        String url = "http://" + Config.SERVER_ADDRESS + "/lastrecord";
        Map<String, String> params = new HashMap<String, String>();
        params.put("Hospital_ID", Config.HOSPITAL_ID);
        params.put("Staff_ID", Config.DOCTOR_ID);
        params.put("AdharNo", Data.PATIENT_ID);

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, new JSONObject(params), new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                try {
                    if (jsonObject.getString("status").equals("200")) {
                        mDialog.dismiss();
                        chronic_desease_tv.setText("Chronic Disease : "+jsonObject.getString("ChronicDisease"));
                        last_diagonised_desease_tv.setText("Disease : "+jsonObject.getString("Disease"));
                        on_date_tv.setText("Diagonasis Date : "+jsonObject.getString("timestamp"));
                        symptomps_tv.setText("Symptom : "+jsonObject.getString("symptom"));

                    }
                    else
                    {
                        //Toast.makeText(getContext(), "Unauthorized to access record of this patient", Toast.LENGTH_LONG).show();
                        mDialog.dismiss();
                    }
                }
                catch (Exception e)
                {
                    mDialog.dismiss();
                    Toast.makeText(getContext(), e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                mDialog.dismiss();
               // Toast.makeText(getContext(), error.getLocalizedMessage(), Toast.LENGTH_LONG).show();
            }
        }) {
            @Override
            protected Map<String, String> getParams() {
                return null;
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/JSON");
                return params;
            }
        };
        volleyRequestQueue.add(request);
    }

    @Override
    public void onResume()
    {
        super.onResume();
        getData();
    }

}
