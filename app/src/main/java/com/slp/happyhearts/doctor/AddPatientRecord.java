
package com.slp.happyhearts.doctor;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.TextView;
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
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;

public class AddPatientRecord extends AppCompatActivity implements View.OnClickListener
{
    private TextView patient_name_tv;
    private EditText disease_et,disease_type_et,disease_catagory_et,disease_sub_catagory_et,allergies_et,symptopms_et, medicines_et,tests_et,hospital_fees_et,pharmacy_fees_et,consultancy_fees_et,ac_fees_et;
    private RadioButton yes_rb,no_rb,flag_yes_rb,flag_no_rb;
    private Button submit_bt;
    private String disease,disease_type,disease_catagory,disease_sub_catagory,allergies,symptopms,medicines,tests,alcohol,smoking,flag_record,consultancy_fees,pharmacy_fees,hospital_fees,ac_fees;
    private RequestQueue volleyRequestQueue;

    @Override
    public void onCreate(Bundle b)
    {
        super.onCreate(b);
        setContentView(R.layout.add_patient_record_doctor_activity);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        toolbar.setNavigationIcon(R.drawable.ic_arrow_back_white_24dp);
        toolbar.setNavigationOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        patient_name_tv=(TextView)findViewById(R.id.patient_name_tv);
        disease_et=(EditText)findViewById(R.id.disease_et);
        disease_type_et=(EditText)findViewById(R.id.disease_type_et);
        disease_type_et.setOnFocusChangeListener(new CheckForNAinEditor(disease_type_et));
        disease_catagory_et=(EditText)findViewById(R.id.disease_catagory_et);
        disease_catagory_et.setOnFocusChangeListener(new CheckForNAinEditor(disease_catagory_et));
        disease_sub_catagory_et=(EditText)findViewById(R.id.disease_sub_catagory_et);
        disease_sub_catagory_et.setOnFocusChangeListener(new CheckForNAinEditor(disease_sub_catagory_et));
        allergies_et=(EditText)findViewById(R.id.allergies_et);
        allergies_et.setOnFocusChangeListener(new CheckForNAinEditor(allergies_et));
        symptopms_et=(EditText)findViewById(R.id.symptopms_et);
        medicines_et=(EditText)findViewById(R.id.medicines_et);
        tests_et=(EditText)findViewById(R.id.tests_et);
        yes_rb=(RadioButton)findViewById(R.id.yes_rb);
        no_rb=(RadioButton)findViewById(R.id.no_rb);
        flag_yes_rb=(RadioButton)findViewById(R.id.flag_yes_rb);
        flag_no_rb=(RadioButton)findViewById(R.id.flag_no_rb);
        submit_bt=(Button)findViewById(R.id.submit_bt);
        submit_bt.setOnClickListener(this);
        volleyRequestQueue = Volley.newRequestQueue(this);
        patient_name_tv.setText("Patient Name : "+Data.PATIENT_NAME);
        hospital_fees_et=(EditText)findViewById(R.id.hospital_fees_et);
        hospital_fees_et.setOnFocusChangeListener(new CheckForZeroInEditor(hospital_fees_et));
        ac_fees_et=(EditText)findViewById(R.id.ac_fees_et);
        ac_fees_et.setOnFocusChangeListener(new CheckForZeroInEditor(ac_fees_et));
        consultancy_fees_et=(EditText)findViewById(R.id.consultancy_fees_et);
        consultancy_fees_et.setOnFocusChangeListener(new CheckForZeroInEditor(consultancy_fees_et));
        pharmacy_fees_et=(EditText)findViewById(R.id.pharmacy_fees_et);
        pharmacy_fees_et.setOnFocusChangeListener(new CheckForZeroInEditor(pharmacy_fees_et));
    }

    /**
     * Checks in Edit Text control have NA string
     */
    class CheckForNAinEditor implements View.OnFocusChangeListener
    {
        EditText et;
        CheckForNAinEditor(EditText et)
        {
            this.et=et;
        }
        @Override
        public void onFocusChange(View v, boolean hasFocus)
        {
            if(et.getText().toString().trim().equals("NA"))
            {
                et.setText("");
            }
            else
            if(et.getText().toString().trim().equals(""))
            {
                et.setText("NA");
            }

        }
    }

    class CheckForZeroInEditor implements View.OnFocusChangeListener
    {
        EditText et;
        CheckForZeroInEditor(EditText et)
        {
            this.et=et;
        }
        @Override
        public void onFocusChange(View v, boolean hasFocus)
        {
            if(et.getText().toString().trim().equals("0"))
            {
                et.setText("");
            }
            else
            if(et.getText().toString().trim().equals(""))
            {
                et.setText("0");
            }

        }
    }

    private boolean checkFields(String ...s)
    {
        for(String string:s)
            if(string.isEmpty())
            {
                Toast.makeText(getBaseContext(),"Enter missing field",Toast.LENGTH_SHORT).show();
                return false;
            }
        return true;
    }

    @Override
    public void onClick(View v)
    {
        disease=disease_et.getText().toString().trim();
        disease_type=disease_type_et.getText().toString().trim();
        disease_catagory=disease_catagory_et.getText().toString().trim();
        disease_sub_catagory=disease_sub_catagory_et.getText().toString().trim();
        allergies=allergies_et.getText().toString().trim();
        symptopms=symptopms_et.getText().toString().trim();
        medicines=medicines_et.getText().toString().trim();
        tests=tests_et.getText().toString().trim();
        hospital_fees=hospital_fees_et.getText().toString().trim();
        consultancy_fees=consultancy_fees_et.getText().toString().trim();
        ac_fees=ac_fees_et.getText().toString().trim();
        pharmacy_fees=pharmacy_fees_et.getText().toString().trim();

        if(checkFields(disease,disease_type,disease_catagory,disease_sub_catagory,allergies,symptopms,medicines,tests,consultancy_fees,pharmacy_fees,ac_fees,hospital_fees))
        {
            if(!yes_rb.isChecked() && !no_rb.isChecked())
                Toast.makeText(getBaseContext(), "Choose Smoking Details", Toast.LENGTH_SHORT).show();
            else if(!flag_yes_rb.isChecked() && !flag_no_rb.isChecked())
                Toast.makeText(getBaseContext(), "Choose record importance", Toast.LENGTH_SHORT).show();
            else
            {
                if(yes_rb.isChecked())
                {
                    alcohol="Yes";
                    smoking="Yes";
                }
                else
                {
                    alcohol="No";
                    smoking="No";
                }
                if(flag_yes_rb.isChecked())
                {
                    flag_record="true";
                }
                else
                {
                    flag_record="false";
                }
                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
                alertDialogBuilder.setTitle("Submit Record");

                // set dialog message
                alertDialogBuilder
                        .setMessage("Are you sure")
                        .setCancelable(false)
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id)
                            {
                                submitData();
                            }
                        }).setNegativeButton("No", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id)
                    {
                    }
                });
                AlertDialog alertDialog = alertDialogBuilder.create();
                alertDialog.show();

            }
        }
    }

    private void submitData()
    {
        final ProgressDialog mDialog = new ProgressDialog(this);
        mDialog.setCancelable(false);
        mDialog.setMessage("Submiting Record");
        mDialog.show();
        String url = Data.addPatientRecordURL;
        Map<String, String> item = new HashMap<String, String>();
        item.put("$class","org.example.basic.TreatmentDetails");
        item.put("HospitalName", Config.HOSPITAL_ID);
        item.put("StaffId", Config.DOCTOR_ID);
        item.put("patientData","resource:org.example.basic.PatientData#"+Data.PATIENT_ID);
        item.put("PinCode","Sangli");
        item.put("ChronicDisease","NA");
        item.put("Disease",disease);
        item.put("DiseaseType",disease_type);
        item.put("DiseaseCategory",disease_catagory);
        item.put("DiseaseSubCategory",disease_sub_catagory);
        item.put("allergies",allergies);
        item.put("AlcoholConsumption",alcohol);
        item.put("SmokingHabits",smoking);
        item.put("medicines",medicines);
        item.put("tests",tests);
        item.put("symptom",symptopms);
        item.put("Flag",flag_record);
        item.put("HospitalFees",hospital_fees);
        item.put("AcFees",ac_fees);
        item.put("PharmacyFees",pharmacy_fees);
        item.put("ConsultancyFees",consultancy_fees);
        JSONObject jsonObject =new JSONObject(item);
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonObject, new Response.Listener<JSONObject>()
        {
            @Override
            public void onResponse(JSONObject response)
            {
                try {
                    if (response.getString("status").equals("200"))
                    {
                        Toast.makeText(getBaseContext(),"Record Submitted Successfully",Toast.LENGTH_SHORT).show();
                        mDialog.dismiss();
                        finish();
                    }
                    else
                    {
                        Toast.makeText(getBaseContext(), "Unable to submit record", Toast.LENGTH_LONG).show();
                    }
                    mDialog.dismiss();
                }catch (Exception e)
                {
                    Toast.makeText(getBaseContext(), e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                    mDialog.dismiss();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                mDialog.dismiss();
                Toast.makeText(getBaseContext(),error.toString() , Toast.LENGTH_LONG).show();
            }
        }) {
            @Override
            protected Map<String, String> getParams() {
                return null;
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError
            {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/json");
                return params;
            }
        };
        volleyRequestQueue.add(request);
    }

    @Override
    public void onBackPressed()
    {
        super.onBackPressed();
        finish();
    }
}