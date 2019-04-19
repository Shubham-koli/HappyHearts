package com.slp.happyhearts.patient;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
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
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.slp.happyhearts.Config;
import com.slp.happyhearts.R;
import com.slp.happyhearts.doctor.adapters.RecyclerItemClickListener;
import com.slp.happyhearts.patient.adapters.AccessRequestsAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GrantAccessFragment extends Fragment
{
    private RecyclerView hospital_requests_rv;
    private List<String[]> items;
    private RequestQueue volleyRequestQueue;
    private AccessRequestsAdapter accessRequestsAdapter;
    private String [] data;
    private LinearLayout linerLayout;
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        return inflater.inflate(R.layout.requests_from_doctors_patient_fragment, container, false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        linerLayout=(LinearLayout)view.findViewById(R.id.layout);
        hospital_requests_rv=(RecyclerView)view.findViewById(R.id.hospital_requests_rv);
        LinearLayoutManager mLayoutManager = new LinearLayoutManager(getActivity());
        hospital_requests_rv.setLayoutManager(mLayoutManager);
        hospital_requests_rv.setItemAnimator(new DefaultItemAnimator());
        items=new ArrayList<String[]>();
        volleyRequestQueue = Volley.newRequestQueue(getContext());
        RecyclerItemClickListener.OnItemClickListener onItemClickListener=new RecyclerItemClickListener.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position)
            {
                data=items.get(position);
                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getContext());
                alertDialogBuilder.setTitle(data[1]);// set dialog message
                alertDialogBuilder
                        .setMessage("Select Option For "+data[0]+" Request")
                        .setCancelable(false)
                        .setPositiveButton("Accept", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id)
                            {
                                   acceptResponse();
                            }
                        }).setNegativeButton("Deny", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id)
                    {
                                    denyResponse();
                    }
                });
                AlertDialog alertDialog = alertDialogBuilder.create();
                alertDialog.show();
            }

            @Override
            public void onLongItemClick(View view, int position) {

            }
            };
        hospital_requests_rv.addOnItemTouchListener(new RecyclerItemClickListener(getContext(),hospital_requests_rv,onItemClickListener));
        accessRequestsAdapter = new AccessRequestsAdapter(items);
        hospital_requests_rv.setAdapter(accessRequestsAdapter);
    }


    private void getRequests()
    {
        final ProgressDialog mDialog = new ProgressDialog(getContext());
        mDialog.setCancelable(false);
        mDialog.setMessage("Getting requests");
        mDialog.show();
        items.clear();
        String url = "http://" + Config.SERVER_ADDRESS + "/openaccess";
        Map<String, String> params = new HashMap<String, String>();
        params.put("AdharNo", MainActivityPatient.PATIENT_ID);
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
                        String[] item;
                        for (int i = 0; i < response.length(); i++) {
                            JSONObject jsonObject = (JSONObject) response.get(i);
                            item = new String[4];
                            item[1]=jsonObject.getString("StaffName");
                            item[0]=jsonObject.getString("HospitalName");
                            item[2]=jsonObject.getString("Staff_ID");
                            item[3]=jsonObject.getString("Hospital_ID");
                            items.add(item);
                        }
                    } catch (Exception e) {
                        mDialog.dismiss();
                        Toast.makeText(getContext(), e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                    }
                    accessRequestsAdapter.notifyDataSetChanged();
                } else {
                    mDialog.dismiss();
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
                    tv.setText("Requests are not available from any doctor\n(Click reload to check again)");
                    tv.setTextSize(15);
                    tv.setTextColor(Color.parseColor("#3F51B5"));
                    tv.setGravity(Gravity.CENTER);
                    linerLayout.addView(tv);
                    //error("Requests are not available");
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
                tv.setText("Unable to connect to server");
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
            public Map<String, String> getHeaders() throws AuthFailureError
            {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/json");
                return params;
            }
        };
        volleyRequestQueue.add(request);
    }


    private void acceptResponse()
    {
        final ProgressDialog mDialog = new ProgressDialog(getContext());
        mDialog.setCancelable(false);
        mDialog.setMessage("Sending response");
        mDialog.show();
        String url = "http://" + Config.SERVER_ADDRESS + "/grant";
        Map<String, String> params = new HashMap<String, String>();
        params.put("AdharNo", MainActivityPatient.PATIENT_ID);
        params.put("Hospital_ID",data[3]);
        params.put("Staff_ID",data[2]);
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, new JSONObject(params), new Response.Listener<JSONObject>()
        {
            @Override
            public void onResponse(JSONObject response)
            {
                try {
                    if (response.getString("response").equals("200"))
                    {
                         mDialog.dismiss();
                         Toast.makeText(getContext(),"Response submitted successfully",Toast.LENGTH_SHORT).show();
                         getRequests();
                    } else {
                        mDialog.dismiss();
                        error("Unable to submit response");
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                mDialog.dismiss();
                error("Unable to connect to server");
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

    private void denyResponse()
    {
        final ProgressDialog mDialog = new ProgressDialog(getContext());
        mDialog.setCancelable(false);
        mDialog.setMessage("Sending response");
        mDialog.show();
        String url = "http://" + Config.SERVER_ADDRESS + "/deny";
        Map<String, String> params = new HashMap<String, String>();
        params.put("AdharNo", MainActivityPatient.PATIENT_ID);
        params.put("Hospital_ID",data[3]);
        params.put("Staff_ID",data[2]);
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, new JSONObject(params), new Response.Listener<JSONObject>()
        {
            @Override
            public void onResponse(JSONObject response)
            {
                try {
                    if (response.getString("response").equals("200"))
                    {
                        mDialog.dismiss();
                        Toast.makeText(getContext(),"Response submitted successfully",Toast.LENGTH_SHORT).show();
                        getRequests();
                    } else {
                        mDialog.dismiss();
                        error("Unable to submit response");
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                mDialog.dismiss();
                error("Unable to connect to server");
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
    void error(String message)
    {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getContext());
        alertDialogBuilder.setTitle(message);// set dialog message
        alertDialogBuilder
                .setCancelable(false)
                .setPositiveButton("Refresh", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id)
                    {
                        getRequests();
                    }
                });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }

    @Override
    public void onResume()
    {
        super.onResume();
        getRequests();
    }

}