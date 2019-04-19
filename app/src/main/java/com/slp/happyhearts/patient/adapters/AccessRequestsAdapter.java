package com.slp.happyhearts.patient.adapters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.slp.happyhearts.R;

import java.util.List;


public class AccessRequestsAdapter extends RecyclerView.Adapter<AccessRequestsAdapter.MyViewHolder>
{
    private List<String[]> items;
    public class MyViewHolder extends RecyclerView.ViewHolder
    {
        private TextView hostpital_name_tv,staff_name_tv;

        public MyViewHolder(View view)
        {
            super(view);
            hostpital_name_tv = (TextView) view.findViewById(R.id.hospital_name_tv);
            staff_name_tv = (TextView) view.findViewById(R.id.staff_name_tv);
        }
    }


    public AccessRequestsAdapter(List<String[]> items)
    {
        this.items = items;
    }

    @Override
    public AccessRequestsAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType)
    {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.requests_from_doctors_row, parent, false);
        return new AccessRequestsAdapter.MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(AccessRequestsAdapter.MyViewHolder holder, int position)
    {
       String[] item =items.get(position);
        holder.hostpital_name_tv.setText("Hospital : "+item[0]);
        holder.staff_name_tv.setText("Staff Name : "+item[1]);
    }

    @Override
    public int getItemCount()
    {
        return items.size();
    }
}
