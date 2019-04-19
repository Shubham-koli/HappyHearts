package com.slp.happyhearts.patient;

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
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.slp.happyhearts.Config;
import com.slp.happyhearts.MainActivity;
import com.slp.happyhearts.R;
import com.slp.happyhearts.doctor.LivePatientFragment;

public class MainActivityPatient extends AppCompatActivity
{
    public static String doctor_id=null;
    private DrawerLayout mDrawerLayout;
    private SharedPreferences prefs;
    public static String PATIENT_ID;
    public static String NAME;
    @Override
    protected void onCreate(Bundle b)
    {
        super.onCreate(b);
        setContentView(R.layout.patient_home_layout);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionbar = getSupportActionBar();
        actionbar.setDisplayHomeAsUpEnabled(true);
        mDrawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view_patient);
        actionbar.setDisplayHomeAsUpEnabled(true);
        actionbar.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#303F9F")));
        actionbar.setHomeAsUpIndicator(R.drawable.ic_menu);
        prefs= getSharedPreferences(Config.PREFERENCE_NAME, Activity.MODE_PRIVATE);
        PATIENT_ID=prefs.getString("UserID",null);
        NAME=prefs.getString("NAME",null);
        View headerView = navigationView.getHeaderView(0);
        ImageView imageView=(ImageView)headerView.getRootView().findViewById(R.id.imageView);
        imageView.setImageResource(R.drawable.ic_patient);
        TextView staff_name_tv=(TextView)headerView.getRootView().findViewById(R.id.staff_name_tv);
        staff_name_tv.setText(NAME);
        TextView type=(TextView)headerView.getRootView().findViewById(R.id.type_tv);
        type.setText("Patient App");
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
        FragmentTransaction tx = getSupportFragmentManager().beginTransaction();
        tx.replace(R.id.content_frame, new GrantAccessFragment());
        tx.commit();
        setTitle("Grant Access");
        navigationView.setCheckedItem(R.id.grant_access_patient_menu_);
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
            case R.id.grant_access_patient_menu_:            //grant access menu
            {
                fragmentClass=GrantAccessFragment.class;
                break;
            }

            case R.id.my_treatments_menu:                    //my treatment menu
            {
                fragmentClass=TreatmentHistoryForPatientFragment.class;
                break;
            }

            case R.id.logout_patient_menu:
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
