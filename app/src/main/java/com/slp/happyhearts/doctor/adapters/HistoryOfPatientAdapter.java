package com.slp.happyhearts.doctor.adapters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.slp.happyhearts.R;

import java.util.List;
import java.util.Map;


public class HistoryOfPatientAdapter extends RecyclerView.Adapter<HistoryOfPatientAdapter.MyViewHolder>
{
    private List<Map<String,String>> items;
    public class MyViewHolder extends RecyclerView.ViewHolder
    {
        private TextView desease_name_tv,desease_type_tv,date_tv;

        public MyViewHolder(View view)
        {
            super(view);
            desease_name_tv = (TextView) view.findViewById(R.id.desease_name_tv);
            desease_type_tv = (TextView) view.findViewById(R.id.desease_type_tv);
            date_tv=(TextView)view.findViewById(R.id.date_tv);
        }
    }


    public HistoryOfPatientAdapter(List<Map<String,String>> items)
    {
        this.items = items;
    }

    @Override
    public HistoryOfPatientAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType)
    {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.history_of_patient_doctor_row, parent, false);
        return new HistoryOfPatientAdapter.MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(HistoryOfPatientAdapter.MyViewHolder holder, int position)
    {
        Map<String,String> item = items.get(position);
        holder.desease_name_tv.setText("Disease : "+item.get("Disease"));
        holder.desease_type_tv.setText("Disease Type : "+item.get("DiseaseType"));
        holder.date_tv.setText("Digonasis Date : "+item.get("Date"));
    }

    @Override
    public int getItemCount()
    {
        return items.size();
    }
}
