package com.slp.happyhearts.patient;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class TreatmentDetailsForPatient extends AppCompatActivity
{
    private TextView disease_tv,disease_type_tv,disease_catagory_tv,disease_sub_catagory_tv,chronic_disease_tv,hospital_name_tv,address_tv,staff_name_tv,medicines_tv,date_tv,alcohol_consumption_tv,smoking_habit_tv,tests_tv,hospital_fees_tv,farmacy_fees_tv,ac_fees_tv,consultancy_fess_tv;
    private Map<String,String> item;
    private Button claim_insurence_bt;
    final String url = "http://" + Config.SERVER_ADDRESS + "/treamentHistory";
    private RequestQueue volleyRequestQueue;
    private ProgressDialog mDialog;
    @Override
    protected void onCreate(Bundle b)
    {
        super.onCreate(b);
        setContentView(R.layout.treatment_details_for_patient);
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
        hospital_fees_tv=(TextView)findViewById(R.id.consultancy_fees_tv);
        farmacy_fees_tv=(TextView)findViewById(R.id.pharmacy_fees_tv);
        ac_fees_tv=(TextView)findViewById(R.id.ac_fees_tv);
        consultancy_fess_tv=(TextView)findViewById(R.id.consultancy_fees_tv);
        claim_insurence_bt=(Button)findViewById(R.id.claim_insurance_bt);

        /*retriveing and setting data to textviews */
        Bundle bundle=getIntent().getBundleExtra("bundle");
        item=(Map<String,String>)bundle.getSerializable("data");
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
        hospital_fees_tv.setText("Hospital Fees : "+item.get("hospital_fees"));
        farmacy_fees_tv.setText("Hospital Fees : "+item.get("farmacy_fees"));
        ac_fees_tv.setText("Hospital Fees : "+item.get("ac_fees"));
        consultancy_fess_tv.setText("Hospital Fees : "+item.get("consultancy_fess"));
        mDialog = new ProgressDialog(getBaseContext());
        mDialog.setCancelable(false);
        mDialog.setMessage("Submitting Claim");
        String transactionId=item.get("transactionId");
        volleyRequestQueue=Volley.newRequestQueue(this);
        JSONObject param=new JSONObject();
        try
        {
            param.put("AdharId",MainActivityPatient.PATIENT_ID);
            param.put("TransId",transactionId);
        }
        catch (JSONException e)
        {
            Toast.makeText(this,e.getLocalizedMessage(),Toast.LENGTH_LONG).show();
        }
        /////////////////////////claim request for server ////////////////////////////////////////////
        final JsonObjectRequest jsonObjectRequest=new JsonObjectRequest(Request.Method.POST, url, param, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response)
            {
                mDialog.dismiss();
                try
                {
                    if(response.getString("response").equals("200"))
                     {
                         response();
                     }
                     else
                    {
                        error("Unable to connect to server");
                    }
                }
                catch (JSONException e)
                {
                    Toast.makeText(getBaseContext(),e.getLocalizedMessage(),Toast.LENGTH_LONG).show();
                }
            }
        }, new Response.ErrorListener()
        {
            @Override
            public void onErrorResponse(VolleyError error)
            {
                mDialog.dismiss();
                Toast.makeText(getBaseContext(),error.getLocalizedMessage(),Toast.LENGTH_LONG).show();
            }
        })
            {
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
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        claim_insurence_bt.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                mDialog.show();
                volleyRequestQueue.add(jsonObjectRequest);
            }
        });
    }

    @Override
    public void onBackPressed()
    {
        super.onBackPressed();
        finish();
    }

    @Override

    public void onPause()
    {
        super.onPause();
        finish();
    }

    void error(String message)
    {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getBaseContext());
        alertDialogBuilder.setTitle(message);// set dialog message
        alertDialogBuilder
                .setCancelable(false)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id)
                    {
                    }
                });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }

    void response()
    {
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getBaseContext());
            alertDialogBuilder.setTitle("Claim Is Submitted Successfully");// set dialog message
            alertDialogBuilder
                    .setCancelable(false)
                    .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id)
                        {
                            finish();
                        }
                    });
            AlertDialog alertDialog = alertDialogBuilder.create();
            alertDialog.show();
    }
}
