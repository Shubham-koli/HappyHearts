package com.slp.happyhearts.patient.adapters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.slp.happyhearts.R;

import java.util.List;


public class InsuranceListAdapter extends RecyclerView.Adapter<InsuranceListAdapter.MyViewHolder>
{
    private List<String[]> items;
    public class MyViewHolder extends RecyclerView.ViewHolder
    {
        private TextView provider_name_tv,insurence_for_tv;

        public MyViewHolder(View view)
        {
            super(view);
            provider_name_tv = (TextView) view.findViewById(R.id.provider_name_tv);
            insurence_for_tv = (TextView) view.findViewById(R.id.insurance_for_tv);
        }
    }


    public InsuranceListAdapter(List<String[]> items)
    {
        this.items = items;
    }

    @Override
    public InsuranceListAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType)
    {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.insurance_provider_row, parent, false);
        return new InsuranceListAdapter.MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(InsuranceListAdapter.MyViewHolder holder, int position)
    {
       String[] item =items.get(position);
        holder.provider_name_tv.setText(item[0]);
        holder.insurence_for_tv.setText(item[1]);
    }

    @Override
    public int getItemCount()
    {
        return items.size();
    }
}
