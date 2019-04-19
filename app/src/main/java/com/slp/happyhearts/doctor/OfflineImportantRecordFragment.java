package com.slp.happyhearts.doctor;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class OfflineImportantRecordFragment extends Fragment
{
    private EditText uid_et;
    private Button access_bt;
    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        return inflater.inflate(R.layout.get_access_docotor_fragment, container, false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        uid_et=(EditText)view.findViewById(R.id.uid_et);
        access_bt=(Button)view.findViewById(R.id.get_access_bt);
        access_bt.setText("  View Records  ");
        access_bt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                if(uid_et.getText().toString().trim().length()<12)
                {
                    Data.PATIENT_ID=uid_et.getText().toString().trim();
                    startActivity(new Intent(getContext(),OfflineImportantRecordActivity.class));
                    uid_et.setText("");
                }
                else
                    Toast.makeText(getContext(),"Please enter valid adhar number",Toast.LENGTH_SHORT).show();
            }
        });
    }

}

