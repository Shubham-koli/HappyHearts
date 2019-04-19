package com.slp.happyhearts.doctor;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
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
import com.slp.happyhearts.doctor.adapters.LivePatientItemAdapter;
import com.slp.happyhearts.doctor.adapters.RecyclerItemClickListener;

import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LivePatientFragment extends Fragment
{
    private RecyclerView live_patient_rv;
    private List<String[]> items;
    private LivePatientItemAdapter livePatientItemAdapter;
    private RequestQueue volleyRequestQueue;
    private LinearLayout linerLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        return inflater.inflate(R.layout.live_patient_doctor_fragment, container, false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        live_patient_rv=(RecyclerView)view.findViewById(R.id.live_patient_rv);
        linerLayout=(LinearLayout)view.findViewById(R.id.layout);
        LinearLayoutManager mLayoutManager = new LinearLayoutManager(getActivity());
        live_patient_rv.setLayoutManager(mLayoutManager);
        live_patient_rv.setItemAnimator(new DefaultItemAnimator());
        items=new ArrayList<String[]>();
        volleyRequestQueue = Volley.newRequestQueue(getContext());

        RecyclerItemClickListener.OnItemClickListener onItemClickListener=new RecyclerItemClickListener.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position)
            {
                final String [] data=items.get(position);
                Data.PATIENT_NAME=data[0];
                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getActivity());
                alertDialogBuilder.setTitle(data[0]);// set dialog message
                alertDialogBuilder
                        .setMessage("Select option for this patient")
                        .setCancelable(true)
                        .setPositiveButton("Add record", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id)
                            {
                                Data.PATIENT_ID=new String(data[1]);
                                startActivity(new Intent(getContext(), AddPatientRecord.class));
                            }
                        }).setNegativeButton("View record", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id)
                            {
                                Data.PATIENT_ID=new String(data[1]);
                                startActivity(new Intent(getContext(), PatientRecord.class));
                            }
                });
                AlertDialog alertDialog = alertDialogBuilder.create();
                alertDialog.show();
            }

            @Override
            public void onLongItemClick(View view, int position) {

            }
        };
        live_patient_rv.addOnItemTouchListener(new RecyclerItemClickListener(getContext(),live_patient_rv,onItemClickListener));
    }

    public void getData()
    {
        final ProgressDialog mDialog = new ProgressDialog(getContext());
        mDialog.setCancelable(false);
        mDialog.setMessage("Getting live patients...");
        mDialog.show();
        items.clear();
        livePatientItemAdapter =new LivePatientItemAdapter(items);
        live_patient_rv.setAdapter(livePatientItemAdapter);
        String url = "http://" + Config.SERVER_ADDRESS + "/patientlist";
        Map<String, String> params = new HashMap<String, String>();
        params.put("Hospital_ID", Config.HOSPITAL_ID);
        params.put("Staff_ID", Config.DOCTOR_ID);
        JSONArray jsonParam=new JSONArray();
        jsonParam.put(new JSONObject(params));
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST, url,jsonParam,new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray jsonArray)
            {
                if(!jsonArray.isNull(0))
                {
                    try
                    {
                        mDialog.dismiss();
                        String item[];
                        for (int i = 0; i < jsonArray.length(); i++)
                        {
                            JSONObject jsonObject = (JSONObject) jsonArray.get(i);
                            item = new String[2];
                            item[0]=jsonObject.get("pname").toString();
                            item[1]=jsonObject.get("uid").toString();
                            items.add(item);
                        }
                    }
                    catch (Exception e)
                    {
                        mDialog.dismiss();
                        Toast.makeText(getContext(), e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                    }
                    livePatientItemAdapter.notifyDataSetChanged();
                }
                else
                {
                    linerLayout.removeAllViews();
                    linerLayout.setGravity(Gravity.CENTER);
                    ImageView imageView=new ImageView(getActivity());
                    imageView.setImageResource(R.drawable.ic_refresh_black_24dp);
                    LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(100, 100);
                    imageView.setLayoutParams(layoutParams);
                    imageView.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            getActivity().recreate();
                        }
                    });
                    linerLayout.addView(imageView);
                    TextView tv=new TextView(getActivity());
                    tv.setText("No live patient available");
                    tv.setTextSize(15);
                    tv.setTextColor(Color.parseColor("#3F51B5"));
                    tv.setGravity(Gravity.CENTER);
                    linerLayout.addView(tv);
                    //error("No live patient available");
                    mDialog.dismiss();
                }
            }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    mDialog.dismiss();
                    Toast.makeText(getContext(),error.toString(),Toast.LENGTH_SHORT).show();
                    linerLayout.removeAllViews();
                    linerLayout.setGravity(Gravity.CENTER);
                    ImageView imageView=new ImageView(getActivity());
                    imageView.setImageResource(R.drawable.ic_refresh_black_24dp);
                    LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(100, 100);
                    imageView.setLayoutParams(layoutParams);
                    imageView.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            getActivity().recreate();
                        }
                    });
                    linerLayout.addView(imageView);
                    TextView tv=new TextView(getActivity());
                    tv.setText("Unable to connect to server\n(check for offline records or refresh)");
                    tv.setTextSize(15);
                    tv.setTextColor(Color.parseColor("#3F51B5"));
                    tv.setGravity(Gravity.CENTER);
                    linerLayout.addView(tv);
                    //error("Unable to connect to server");
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
    void error(String message)
    {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getContext());
        alertDialogBuilder.setTitle(message);// set dialog message
        alertDialogBuilder
                .setCancelable(true)
                .setNegativeButton("Work Offline", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id)
                    {
                        startActivity(new Intent(getContext(),OfflineImportantRecordActivity.class));
                    }
                }).setCancelable(false)
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
