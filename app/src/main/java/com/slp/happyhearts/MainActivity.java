package com.slp.happyhearts;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.Toast;

import com.slp.happyhearts.doctor.DoctorLogin;
import com.slp.happyhearts.doctor.MainActivityDoctor;
import com.slp.happyhearts.doctor.adapters.Data;
import com.slp.happyhearts.patient.MainActivityPatient;
import com.slp.happyhearts.patient.PatientLogin;

public class MainActivity extends AppCompatActivity
{
    private RadioButton hospital_rb,patient_rb;
    private SharedPreferences prefs;
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        prefs= getSharedPreferences(Config.PREFERENCE_NAME, Activity.MODE_PRIVATE);
        if(prefs.getString("USER_TYPE",null)!=null)
            if(prefs.getString("USER_TYPE",null).equals("STAFF"))
            {
                startActivity(new Intent(this,MainActivityDoctor.class));
                finish();
            }
            else
            {
                startActivity(new Intent(this,MainActivityPatient.class));
                finish();
            }

        setContentView(R.layout.activity_main);
        hospital_rb=(RadioButton)findViewById(R.id.hostpital_rb);
        patient_rb=(RadioButton)findViewById(R.id.patient_rb);
        Button continue_bt=(Button)findViewById(R.id.continue_bt);
        continue_bt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                if(hospital_rb.isChecked())
                {
                    startActivity(new Intent(getBaseContext(),DoctorLogin.class));
                    finish();
                }
                else if(patient_rb.isChecked())
                {
                    startActivity(new Intent(getBaseContext(),PatientLogin.class));
                    finish();
                }
                else
                {
                    Toast.makeText(getApplicationContext(),"Please select user type to continue",Toast.LENGTH_SHORT).show();
                }

            }
        });
    }
}
