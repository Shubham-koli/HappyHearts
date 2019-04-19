package com.slp.happyhearts.doctor;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.slp.happyhearts.Config;
import com.slp.happyhearts.MainActivity;
import com.slp.happyhearts.R;
import com.slp.happyhearts.doctor.adapters.Data;

public class MainActivityDoctor extends AppCompatActivity
{
    private DrawerLayout mDrawerLayout;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle b)
    {
        super.onCreate(b);
        setContentView(R.layout.doctor_home_layout);
        prefs= getSharedPreferences(Config.PREFERENCE_NAME, Activity.MODE_PRIVATE);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionbar = getSupportActionBar();
        actionbar.setDisplayHomeAsUpEnabled(true);
        mDrawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view_doctor);
        View headerView = navigationView.getHeaderView(0);
        TextView staff_name_tv=(TextView)headerView.getRootView().findViewById(R.id.staff_name_tv);
        staff_name_tv.setText(prefs.getString("USER_NAME",null));
        TextView type_tv=(TextView)headerView.getRootView().findViewById(R.id.type_tv);
        type_tv.setText("Hospital/Clinic");
        actionbar.setDisplayHomeAsUpEnabled(true);
        actionbar.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#303F9F")));
        actionbar.setHomeAsUpIndicator(R.drawable.ic_menu);

        navigationView.setNavigationItemSelectedListener(
                new NavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(MenuItem menuItem)
                    {
                        mDrawerLayout.closeDrawers();
                        selectDrawerItem(menuItem);
                        return true;
                    }
                });
        Config.HOSPITAL_ID=prefs.getString("hosptial_id",null);
        Config.DOCTOR_ID=prefs.getString("doctor_id",null);
        FragmentTransaction tx = getSupportFragmentManager().beginTransaction();
        tx.replace(R.id.content_frame, new LivePatientFragment());
        tx.commit();
        setTitle("My Patients");
        navigationView.setCheckedItem(R.id.live_patient_doctor_menu);
        navigationView.setSelected(true);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item)
    {
        switch (item.getItemId())
        {
            case android.R.id.home:
                mDrawerLayout.openDrawer(GravityCompat.START);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }


    public void selectDrawerItem(MenuItem menuItem)
    {
        // Create a new fragment and specify the fragment to show based on nav item clicked
        Fragment fragment = null;
        Class fragmentClass=null;
        switch(menuItem.getItemId())
        {
            case R.id.get_access_doctor_menu:
            {
                fragmentClass=GetAccessFragment.class;
                break;
            }
            case R.id.live_patient_doctor_menu:
            {
                fragmentClass=LivePatientFragment.class;
                break;
            }
            case R.id.offline_record_menu:
            {
                fragmentClass=OfflineImportantRecordFragment.class;
                break;
            }
            case R.id.logout_doctor_menu:
            {
                fragmentClass=null;
                getApplicationContext().getSharedPreferences(Config.PREFERENCE_NAME, 0).edit().clear().commit();
                startActivity(new Intent(getApplicationContext(),MainActivity.class));
                finish();
                break;
            }
        }
        try
        {
            if(fragmentClass!=null)
            {
                fragment = (Fragment) fragmentClass.newInstance();
                // Insert the fragment by replacing any existing fragment
                FragmentManager fragmentManager = getSupportFragmentManager();
                fragmentManager.beginTransaction().replace(R.id.content_frame, fragment).commit();
            }
        }
        catch (Exception e)
        {
            Toast.makeText(getApplicationContext(), e.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
        }


        // Highlight the selected item has been done by NavigationView
        menuItem.setChecked(true);
        // Set action bar title
        setTitle(menuItem.getTitle());
        // Close the navigation drawer
        mDrawerLayout.closeDrawers();
    }
}
