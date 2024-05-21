<?php

# Get a string representing the current date and time, in UTC
$current_time = new DateTimeImmutable();
$current_time_string = $current_time->format(DateTimeInterface::ATOM);

$out_data = [
  'api_name' => 'simple-contact-manager',
  'api_version' => '1',
  'date' => $current_time_string,
];

$out_json = json_encode($out_data);
echo $out_json;
