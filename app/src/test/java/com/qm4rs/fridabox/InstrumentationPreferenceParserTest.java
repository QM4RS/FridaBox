package com.qm4rs.fridabox;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class InstrumentationPreferenceParserTest {
    @Test
    public void acceptsValidValues() {
        assertEquals(27043, InstrumentationPreferenceParser.parsePort("27043", 27042));
        assertEquals(32, InstrumentationPreferenceParser.parseScanCount("32", 16));
    }

    @Test
    public void rejectsMalformedAndOutOfRangeValues() {
        assertEquals(27042, InstrumentationPreferenceParser.parsePort("nope", 27042));
        assertEquals(27042, InstrumentationPreferenceParser.parsePort("80", 27042));
        assertEquals(32, InstrumentationPreferenceParser.parseScanCount("999", 32));
    }
}
