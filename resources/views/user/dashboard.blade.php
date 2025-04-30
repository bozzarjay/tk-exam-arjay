@extends('layout.single-page')

@section('single_page')
    <div id="dashboard-index" token="{{ $api_access_token }}"></div>
@endsection