package com.slp.happyhearts.doctor;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Toast;

import com.slp.happyhearts.R;
import com.slp.happyhearts.doctor.adapters.Data;
import com.slp.happyhearts.doctor.adapters.HistoryOfPatientAdapter;
import com.slp.happyhearts.doctor.adapters.RecyclerItemClickListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OfflineImportantRecordActivity extends AppCompatActivity
{
    private RecyclerView history_of_patient_rv;
    private List<Map<String,String>> items;
    private HistoryOfPatientAdapter historyOfPatientAdapter;
    private Database db;
    @Override
    protected void onCreate(Bundle bundle)
    {
        super.onCreate(bundle);
        setContentView(R.layout.offline_history_of_patient_doctor_activity);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        toolbar.setSubtitle(Data.PATIENT_NAME);
        toolbar.setNavigationIcon(R.drawable.ic_arrow_back_white_24dp);
        toolbar.setNavigationOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        history_of_patient_rv = (RecyclerView) findViewById(R.id.patient_history_rv);
        LinearLayoutManager mLayoutManager = new LinearLayoutManager(this);
        history_of_patient_rv.setLayoutManager(mLayoutManager);
        history_of_patient_rv.setItemAnimator(new DefaultItemAnimator());
        db=new Database(this);
        items=new ArrayList<Map<String, String>>();
        RecyclerItemClickListener.OnItemClickListener onItemClickListener = new RecyclerItemClickListener.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position)
            {
                Intent i=new Intent(getApplication(),TreatmentDetailsForDoctor.class);
                i.putExtra("record", (HashMap<String, String>) items.get(position));
                i.putExtra("mode","offline");
                startActivity(i);
            }

            @Override
            public void onLongItemClick(View view, int position) {

            }
        };
        history_of_patient_rv.addOnItemTouchListener(new RecyclerItemClickListener(getBaseContext(), history_of_patient_rv, onItemClickListener));
        historyOfPatientAdapter = new HistoryOfPatientAdapter(items);
        history_of_patient_rv.setAdapter(historyOfPatientAdapter);
    }
    @Override
    public void onResume()
    {
        super.onResume();
        getData();
    }
    @Override
    public void onBackPressed()
    {
        super.onBackPressed();
        finish();
    }

    private void getData()
    {
        items.clear();
        db.getData(Data.PATIENT_ID,items);
        if(items.size()==0)
        {
            Toast.makeText(this,"No record found for this patient",Toast.LENGTH_SHORT).show();
            finish();
        }
        historyOfPatientAdapter.notifyDataSetChanged();
    }
}
