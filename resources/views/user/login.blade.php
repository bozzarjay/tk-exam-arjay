@extends('layout.single-page')

@section('single_page')
    <div id="login-index" data-crsftoken="{{ csrf_token() }}" data-message="{{ $message }}"></div>
@endsection