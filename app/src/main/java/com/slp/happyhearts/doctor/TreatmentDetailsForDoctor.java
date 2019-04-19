package com.slp.happyhearts.doctor;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TreatmentDetailsForDoctor extends AppCompatActivity
{
    private Button claim_insurance_bt;
    private Spinner insurance_provider_spinner;
    private HashMap<String,String> item;
    private RequestQueue volleyRequestQueue;
    private String mode;
    private TextView disease_tv,disease_type_tv,disease_catagory_tv,disease_sub_catagory_tv,chronic_disease_tv,hospital_name_tv,address_tv,staff_name_tv,medicines_tv,date_tv,alcohol_consumption_tv,smoking_habit_tv,tests_tv,insurance_status_tv;
    @Override
    protected void onCreate(Bundle b)
    {
        super.onCreate(b);
        setContentView(R.layout.treatment_details_for_doctor);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        toolbar.setNavigationIcon(R.drawable.ic_arrow_back_white_24dp);
        toolbar.setNavigationOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        item = (HashMap) getIntent().getSerializableExtra("record");
        mode=getIntent().getStringExtra("mode");
        claim_insurance_bt=(Button)findViewById(R.id.claim_insurance_bt);
        disease_tv=(TextView)findViewById(R.id.disease_tv);
        disease_type_tv=(TextView)findViewById(R.id.disease_type_tv);
        disease_catagory_tv=(TextView)findViewById(R.id.disease_catagory_tv);
        disease_sub_catagory_tv=(TextView)findViewById(R.id.disease_sub_catagory_tv);
        chronic_disease_tv=(TextView)findViewById(R.id.chronic_disease_tv);
        hospital_name_tv=(TextView)findViewById(R.id.hospital_name_tv);
        address_tv=(TextView)findViewById(R.id.address_tv);
        staff_name_tv=(TextView)findViewById(R.id.staff_name_tv);
        medicines_tv=(TextView)findViewById(R.id.medicines_tv);
        date_tv=(TextView)findViewById(R.id.date_tv);
        alcohol_consumption_tv=(TextView)findViewById(R.id.alcohol_consumption_tv);
        smoking_habit_tv=(TextView)findViewById(R.id.smoking_habit_tv);
        tests_tv=(TextView)findViewById(R.id.tests_tv);
        insurance_status_tv=(TextView)findViewById(R.id.insurance_status_tv);
        insurance_provider_spinner=(Spinner)findViewById(R.id.insurance_provider_spinner);
        ArrayList<String> insurance_providers=new ArrayList<String>();
        insurance_providers.add("Bajaj");
        insurance_providers.add("Tata insurance");
        insurance_provider_spinner.setAdapter(new ArrayAdapter<String>(getBaseContext(), android.R.layout.simple_spinner_dropdown_item, insurance_providers));
        volleyRequestQueue = Volley.newRequestQueue(this);
    }

    @Override
    public void onResume()
    {
        super.onResume();
        disease_tv.setText("Disease : "+item.get("Disease"));
        disease_type_tv.setText("Disease Type : "+item.get("DiseaseType"));
        disease_catagory_tv.setText("Disease Category : "+item.get("DiseaseCategory"));
        disease_sub_catagory_tv.setText("Disease Sub Category : "+item.get("DiseaseSubCategory"));
        chronic_disease_tv.setText("Chronic Disease : "+item.get("ChronicDisease"));
        hospital_name_tv.setText("Hospital Name : "+item.get("HospitalName"));
        address_tv.setText("Location : "+item.get("Address"));
        staff_name_tv.setText("Staff Name : "+item.get("StaffName"));
        medicines_tv.setText("Medicine Prescriptions : "+item.get("medicines"));
        date_tv.setText("Date : "+item.get("Date"));
        alcohol_consumption_tv.setText("Alcohol Consumption : "+item.get("AlcoholConsumption"));
        smoking_habit_tv.setText("Smoking Habit : "+item.get("SmokingHabits"));
        tests_tv.setText("Tests Conducted : "+item.get("tests"));
        insurance_status_tv.setText("Insurance Status: "+item.get("claimStatus"));
        if(!item.get("claimStatus").equals("OPEN"))
        {

            ViewGroup vg=(ViewGroup)insurance_provider_spinner.getParent();
            vg.removeView(insurance_provider_spinner);
            claim_insurance_bt.setText("  View Details  ");
            claim_insurance_bt.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v)
                {
                    Intent i=new Intent(getBaseContext(),InsuranceClaimDetailsActivity.class);
                    i.putExtra("transactionId",item.get("transactionId"));
                    startActivity(i);
                    finish();
                }
            });
        }
        else
        {
            claim_insurance_bt.setEnabled(true);
            claim_insurance_bt.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {
                    claim();
                }
            });
        }
        if(mode!=null)
            claim_insurance_bt.setEnabled(false);
    }
    @Override
    public void onBackPressed()
    {
        super.onBackPressed();
        finish();
    }
    private void claim()
    {
        final ProgressDialog mDialog = new ProgressDialog(this);
        mDialog.setCancelable(false);
        mDialog.setMessage("Submitting Claim");
        mDialog.show();
        String url = "http://" + Config.SERVER_ADDRESS + "/addclaim";
        Map<String, String> data = new HashMap<String, String>();

        data.put("transactionId",item.get("transactionId"));
        data.put("AdharNo",Data.PATIENT_ID);
        data.put("insurer",insurance_provider_spinner.getSelectedItem().toString());

        JSONObject jsonObject =new JSONObject(data);
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonObject, new Response.Listener<JSONObject>()
        {
            @Override
            public void onResponse(JSONObject response)
            {
                try {
                    if (response.getString("status").equals("200"))
                    {
                        Toast.makeText(getBaseContext(),"Claim Submitted Successfully",Toast.LENGTH_SHORT).show();
                        mDialog.dismiss();
                        item.remove("claimStatus");
                        item.put("claimStatus","Under Process");
                        onResume();
                    }
                    else
                    {
                        Toast.makeText(getBaseContext(), "Unable to submit Claim", Toast.LENGTH_LONG).show();
                        onResume();
                    }
                    mDialog.dismiss();
                }catch (Exception e)
                {
                    Toast.makeText(getBaseContext(), e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                    mDialog.dismiss();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                mDialog.dismiss();
                Toast.makeText(getBaseContext(),error.toString() , Toast.LENGTH_LONG).show();
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
}
