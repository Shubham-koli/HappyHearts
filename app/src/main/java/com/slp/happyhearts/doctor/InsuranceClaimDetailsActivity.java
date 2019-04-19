package com.slp.happyhearts.doctor;

import android.app.ActionBar;
import android.app.ProgressDialog;
import android.graphics.Color;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
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

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class InsuranceClaimDetailsActivity extends AppCompatActivity
{
    private RequestQueue volleyRequestQueue;
    private String transactionId;
    private LinearLayout linearLayout;
    @Override
    protected void onCreate(Bundle b)
    {
        super.onCreate(b);
        setContentView(R.layout.insurance_claim_details_activity);
        transactionId=getIntent().getStringExtra("transactionId");
        linearLayout= (LinearLayout)findViewById(R.id.layout);      //find the linear layout
        volleyRequestQueue = Volley.newRequestQueue(this);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        toolbar.setNavigationIcon(R.drawable.ic_arrow_back_white_24dp);
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    @Override
    public void onResume()
    {
        super.onResume();
        linearLayout.removeAllViews();
        final ProgressDialog mDialog = new ProgressDialog(this);
        mDialog.setCancelable(false);
        mDialog.setMessage("Fetching Details");
        mDialog.show();
        String url =Data.insuranceClaimDetailsURL;
        Map<String, String> data = new HashMap<String, String>();
        data.put("transactionId",transactionId);
        data.put("AdharNo",Data.PATIENT_ID);
        data.put("insurer","Bajaj");
        JSONObject jsonObject =new JSONObject(data);
        final JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonObject, new Response.Listener<JSONObject>()
        {
            @Override
            public void onResponse(JSONObject response)
            {
                try {
                    if(response.getString("status").equals("200"))
                    {
                        response.remove("status");
                        Iterator<String> itr = response.keys();
                        while (itr.hasNext())
                        {
                            String key = itr.next();
                            String value= response.getString(key);
                            TextView textView = new TextView(getBaseContext());
                            LinearLayout.LayoutParams params=new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                            params.setMargins(15,8,15,8);
                            textView.setLayoutParams(params);
                            key=key.replaceAll("_"," ");
                            textView.setText(key+" : "+value);
                            textView.setTextSize(15);
                            textView.setBackgroundColor(Color.parseColor("#eaeff7"));
                            textView.setTextColor(Color.parseColor("#3F51B5"));
                            linearLayout.addView(textView);
                        }
                        mDialog.dismiss();
                    }
                    else
                    {
                        Toast.makeText(getBaseContext(),"Details Not Found",Toast.LENGTH_SHORT).show();
                        mDialog.dismiss();
                        finish();
                    }
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
    @Override
    public void onBackPressed()
    {
        super.onBackPressed();
        finish();

    }
}