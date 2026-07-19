package com.qm4rs.fridabox.sample;

import android.app.Activity;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public final class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        TextView output = new TextView(this);
        output.setTextSize(22f);
        output.setText("Press the button to call Target.add(2, 3)");
        Button button = new Button(this);
        button.setText("Call Target.add(2, 3)");
        button.setOnClickListener(view -> output.setText("Result: " + Target.add(2, 3)));
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setPadding(32, 32, 32, 32);
        root.addView(output);
        root.addView(button);
        setContentView(root);
    }
}
