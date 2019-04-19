package com.slp.happyhearts.doctor;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.slp.happyhearts.Config;
import com.slp.happyhearts.R;
import com.slp.happyhearts.doctor.adapters.Data;
import com.slp.happyhearts.doctor.adapters.HistoryOfPatientAdapter;
import com.slp.happyhearts.doctor.adapters.RecyclerItemClickListener;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HistoryOfPatientFragment extends Fragment
{
    private RecyclerView history_of_patient_rv;
    private List<Map<String,String>> items;
    private HistoryOfPatientAdapter historyOfPatientAdapter;
    private RequestQueue volleyRequestQueue;


    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.treatment_history_of_patient_fragment, container, false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        history_of_patient_rv = (RecyclerView) view.findViewById(R.id.patient_history_rv);
        LinearLayoutManager mLayoutManager = new LinearLayoutManager(getActivity());
        history_of_patient_rv.setLayoutManager(mLayoutManager);
        history_of_patient_rv.setItemAnimator(new DefaultItemAnimator());
        items = new ArrayList<Map<String, String>>();
        volleyRequestQueue = Volley.newRequestQueue(getContext());
        RecyclerItemClickListener.OnItemClickListener onItemClickListener = new RecyclerItemClickListener.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position)
            {
                Intent i=new Intent(getContext(),TreatmentDetailsForDoctor.class);
                i.putExtra("record", (HashMap<String, String>) items.get(position));
                startActivity(i);
            }

            @Override
            public void onLongItemClick(View view, int position) {

            }
        };
        history_of_patient_rv.addOnItemTouchListener(new RecyclerItemClickListener(getContext(), history_of_patient_rv, onItemClickListener));

    }

    public void getData() {
        final ProgressDialog mDialog = new ProgressDialog(getContext());
        mDialog.setCancelable(false);
        mDialog.setMessage("Getting patients history");
        mDialog.show();
        items.clear();
        historyOfPatientAdapter = new HistoryOfPatientAdapter(items);
        history_of_patient_rv.setAdapter(historyOfPatientAdapter);
        String url = "http://" + Config.SERVER_ADDRESS + "/getrecords";
        Map<String, String> params = new HashMap<String, String>();
        params.put("Hospital_ID", Config.HOSPITAL_ID);
        params.put("Staff_ID", Config.DOCTOR_ID);
        params.put("AdharNo", Data.PATIENT_ID);
        JSONArray jsonArray=new JSONArray();
        jsonArray.put(new JSONObject(params));

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST, url, jsonArray, new Response.Listener<JSONArray>()
        {
            @Override
            public void onResponse(JSONArray response)
            {
                if (!response.isNull(0))
                {
                    try {
                        mDialog.dismiss();
                        HashMap<String,String> item;
                        for (int i = 0; i < response.length(); i++) {
                            JSONObject jsonObject = (JSONObject) response.get(i);
                            item = new HashMap<String,String>();
                            item.put("HospitalName",jsonObject.getString("HospitalName"));
                            item.put("HospitalId",jsonObject.getString("HospitalId"));
                            item.put("StaffId",jsonObject.getString("StaffId"));
                            item.put("StaffName",jsonObject.getString("StaffName"));
                            item.put("Address",jsonObject.getString("Address"));
                            item.put("ChronicDisease",jsonObject.getString("ChronicDisease"));
                            item.put("Disease",jsonObject.getString("Disease"));
                            item.put("DiseaseType",jsonObject.getString("DiseaseType"));
                            item.put("DiseaseCategory",jsonObject.getString("DiseaseCategory"));
                            item.put("DiseaseSubCategory",jsonObject.getString("DiseaseSubCategory"));
                            item.put("allergies",jsonObject.getString("allergies"));
                            item.put("AlcoholConsumption",jsonObject.getString("AlcoholConsumption"));
                            item.put("SmokingHabits",jsonObject.getString("SmokingHabits"));
                            item.put("medicines",jsonObject.getString("medicines"));
                            item.put("tests",jsonObject.getString("tests"));
                            item.put("Date",jsonObject.getString("Date"));
                            item.put("claimStatus",jsonObject.getString("claimStatus"));
                            item.put("transactionId",jsonObject.getString("transactionId"));
                            items.add(item);
                        }
                    } catch (Exception e) {
                        mDialog.dismiss();
                        Toast.makeText(getContext(), e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                    }
                    historyOfPatientAdapter.notifyDataSetChanged();
                } else {
                    mDialog.dismiss();
                    error("No record  found");
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                mDialog.dismiss();
                error(error.getLocalizedMessage());
            }
        }) {
            @Override
            protected Map<String, String> getParams() {
                return null;
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError
            {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/json");
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
    void error(String message)
    {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getContext());
        alertDialogBuilder.setTitle(message);// set dialog message
        alertDialogBuilder
                .setNegativeButton("Back", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id)
                    {
                        PatientRecord.patientRecord.finish();
                    }
                })
                .setCancelable(false)
                .setPositiveButton("Refresh", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id)
                    {
                        getData();
                    }
                });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }
}