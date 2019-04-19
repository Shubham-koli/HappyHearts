package com.slp.happyhearts.patient;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import com.slp.happyhearts.Config;
import com.slp.happyhearts.R;

public class PatientLogin extends AppCompatActivity
{
    private EditText username_et,password_et;
    private Button login_bt;
    private SharedPreferences.Editor editor;
    @Override
    protected void onCreate(Bundle b)
    {
        super.onCreate(b);
        setContentView(R.layout.patient_login);
        username_et=(EditText)findViewById(R.id.username);
        password_et=(EditText)findViewById(R.id.password);
        login_bt=(Button)findViewById(R.id.login_bt);
        login_bt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editor = getSharedPreferences(Config.PREFERENCE_NAME, MODE_PRIVATE).edit();

                ////login with static user details////
                editor.putString("UserID","8421999884");
                editor.putString("NAME","Anil Kadam");
                editor.putString("USER_TYPE","PATIENT");
                editor.commit();
                startActivity(new Intent(getBaseContext(),MainActivityPatient.class));
                finish();
            }
        });
    }
}