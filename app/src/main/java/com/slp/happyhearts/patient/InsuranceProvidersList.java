package com.slp.happyhearts.patient;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;
import com.slp.happyhearts.Config;
import com.slp.happyhearts.R;
import com.slp.happyhearts.doctor.adapters.HistoryOfPatientAdapter;
import com.slp.happyhearts.doctor.adapters.RecyclerItemClickListener;
import com.slp.happyhearts.patient.adapters.InsuranceListAdapter;

import org.json.JSONArray;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class InsuranceProvidersList extends AppCompatActivity
{
    private RecyclerView insurance_list_rv;
    private List<String[]> items;                                         //data which will receive
    private InsuranceListAdapter insuranceListAdapter;
    private RequestQueue volleyRequestQueue;
    private ProgressDialog mDialog;
    final String url = "http://" + Config.SERVER_ADDRESS + "/patienthistory";           //server url
    private JSONArray jsonArray;
    @Override
    public void onCreate(Bundle b)
    {
        super.onCreate(b);
        setContentView(R.layout.insurance_providers_list);
        insurance_list_rv = (RecyclerView) findViewById(R.id.insurance_providers_list_rv);
        LinearLayoutManager mLayoutManager = new LinearLayoutManager(this);
        insurance_list_rv.setLayoutManager(mLayoutManager);
        insurance_list_rv.setItemAnimator(new DefaultItemAnimator());
        items = new ArrayList<String[]>();
        volleyRequestQueue = Volley.newRequestQueue(this);
        RecyclerItemClickListener.OnItemClickListener onItemClickListener = new RecyclerItemClickListener.OnItemClickListener() {

            /* getting details for selected treatment */
            @Override
            public void onItemClick(View view, int position)
            {

            }

            @Override
            public void onLongItemClick(View view, int position) {

            }
        };
        insurance_list_rv.addOnItemTouchListener(new RecyclerItemClickListener(this, insurance_list_rv, onItemClickListener));
        insuranceListAdapter = new InsuranceListAdapter(items);
        insurance_list_rv.setAdapter(insuranceListAdapter);
        mDialog = new ProgressDialog(this);
        mDialog.setCancelable(false);
        mDialog.setMessage("Claiming Insurance");
    }

}
