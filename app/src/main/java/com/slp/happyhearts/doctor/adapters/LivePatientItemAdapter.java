package com.slp.happyhearts.doctor.adapters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.slp.happyhearts.R;

import java.util.List;


public class LivePatientItemAdapter extends RecyclerView.Adapter<LivePatientItemAdapter.MyViewHolder>
{
    private List<String[]> items;
    public class MyViewHolder extends RecyclerView.ViewHolder
    {
        private TextView name_tv,uid_tv;

        public MyViewHolder(View view)
        {
            super(view);
            name_tv = (TextView) view.findViewById(R.id.name_tv);
            uid_tv = (TextView) view.findViewById(R.id.uid_tv);
        }
    }


    public LivePatientItemAdapter(List<String[]> items)
    {
        this.items = items;
    }

    @Override
    public LivePatientItemAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType)
    {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.live_patient_doctor_row, parent, false);
        return new LivePatientItemAdapter.MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(LivePatientItemAdapter.MyViewHolder holder, int position)
    {
        String item[] = items.get(position);
        holder.name_tv.setText("Name: " +item[0]);
        holder.uid_tv.setText("Adhar Number: "+item[1]);
    }

    @Override
    public int getItemCount()
    {
        return items.size();
    }
}
